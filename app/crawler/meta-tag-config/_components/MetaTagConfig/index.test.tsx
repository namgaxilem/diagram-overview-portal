import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MetaTagConfig, { MetaTagItem } from './index';

describe('MetaTagConfig', () => {
  const mockOnChange = vi.fn();
  const mockOnSave = vi.fn();

  const mockMetaTags: MetaTagItem[] = [
    {
      id: 'test-1',
      name: 'description',
      type: 'standard',
      attribute: 'name',
      required: true,
      description: 'Page description',
    },
    {
      id: 'test-2',
      name: 'og:title',
      type: 'opengraph',
      attribute: 'property',
      required: false,
      description: 'Open Graph title',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component with initial values', () => {
      render(<MetaTagConfig initValue={mockMetaTags} />);

      expect(screen.getByText('Meta Tag Configuration')).toBeInTheDocument();
      expect(screen.getByText(/Configure which HTML meta tags/i)).toBeInTheDocument();
    });

    it('should display configured meta tags in table', () => {
      render(<MetaTagConfig initValue={mockMetaTags} />);

      expect(screen.getByText('Page description')).toBeInTheDocument();
      expect(screen.getByText('Open Graph title')).toBeInTheDocument();
      
      const descriptionCode = screen.getAllByText('description').find(
        (el) => el.tagName === 'CODE'
      );
      expect(descriptionCode).toBeInTheDocument();
      
      const ogTitleCode = screen.getAllByText('og:title').find(
        (el) => el.tagName === 'CODE'
      );
      expect(ogTitleCode).toBeInTheDocument();
    });

    it('should show correct count of meta tags', () => {
      render(<MetaTagConfig initValue={mockMetaTags} />);

      expect(screen.getByText('Configured Meta Tags (2)')).toBeInTheDocument();
    });

    it('should render in read-only mode', () => {
      render(<MetaTagConfig initValue={mockMetaTags} readOnly />);

      expect(screen.queryByText('Add Meta Tag')).not.toBeInTheDocument();
      expect(screen.queryByText('Save Configuration')).not.toBeInTheDocument();
    });

    it('should show empty state when no tags configured', () => {
      render(<MetaTagConfig initValue={[]} />);

      expect(screen.getByText(/No meta tags configured/i)).toBeInTheDocument();
    });
  });

  describe('Quick Add Common Tags', () => {
    it('should render quick add buttons for common tags', () => {
      render(<MetaTagConfig initValue={[]} />);

      expect(screen.getByRole('button', { name: 'description' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'keywords' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'og:title' })).toBeInTheDocument();
    });

    it('should add common tag when quick add button clicked', async () => {
      const user = userEvent.setup();
      render(<MetaTagConfig initValue={[]} onChange={mockOnChange} />);

      const descriptionButton = screen.getByRole('button', { name: 'description' });
      await user.click(descriptionButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'description',
            type: 'standard',
            attribute: 'name',
          }),
        ])
      );
    });

    it('should disable quick add button if tag already exists', () => {
      render(<MetaTagConfig initValue={mockMetaTags} />);

      const descriptionButton = screen.getByRole('button', { name: 'description' });
      expect(descriptionButton).toBeDisabled();
    });
  });

  describe('Add Meta Tag Form', () => {
    it('should show add form when Add Meta Tag button clicked', async () => {
      const user = userEvent.setup();
      render(<MetaTagConfig initValue={[]} />);

      const addButton = screen.getByRole('button', { name: /Add Meta Tag/i });
      await user.click(addButton);

      expect(screen.getByText('Add New Meta Tag')).toBeInTheDocument();
      expect(screen.getByLabelText(/Meta Tag Name/i)).toBeInTheDocument();
    });

    it('should add new meta tag with valid input', async () => {
      const user = userEvent.setup();
      render(<MetaTagConfig initValue={[]} onChange={mockOnChange} />);

      await user.click(screen.getByRole('button', { name: /Add Meta Tag/i }));

      const nameInput = screen.getByLabelText(/Meta Tag Name/i);
      await user.type(nameInput, 'author');

      const submitButton = screen.getByRole('button', { name: 'Add Meta Tag' });
      await user.click(submitButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'author',
            type: 'standard',
            attribute: 'name',
          }),
        ])
      );
    });

    it('should validate meta tag name pattern', async () => {
      const user = userEvent.setup();
      render(<MetaTagConfig initValue={[]} />);

      await user.click(screen.getByRole('button', { name: /Add Meta Tag/i }));

      const nameInput = screen.getByLabelText(/Meta Tag Name/i);
      await user.type(nameInput, 'invalid name!@#');

      const submitButton = screen.getByRole('button', { name: 'Add Meta Tag' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Only alphanumeric, colon, underscore, and hyphen allowed/i)).toBeInTheDocument();
      });
    });

    it('should require meta tag name', async () => {
      const user = userEvent.setup();
      render(<MetaTagConfig initValue={[]} />);

      await user.click(screen.getByRole('button', { name: /Add Meta Tag/i }));

      const submitButton = screen.getByRole('button', { name: 'Add Meta Tag' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Please enter meta tag name/i)).toBeInTheDocument();
      });
    });

    it('should cancel add form', async () => {
      const user = userEvent.setup();
      render(<MetaTagConfig initValue={[]} />);

      await user.click(screen.getByRole('button', { name: /Add Meta Tag/i }));
      expect(screen.getByText('Add New Meta Tag')).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);

      expect(screen.queryByText('Add New Meta Tag')).not.toBeInTheDocument();
    });
  });

  describe('Edit Meta Tag', () => {
    it('should open edit form when edit button clicked', async () => {
      const user = userEvent.setup();
      render(<MetaTagConfig initValue={mockMetaTags} />);

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);

      expect(screen.getByText('Edit Meta Tag')).toBeInTheDocument();
      expect(screen.getByDisplayValue('description')).toBeInTheDocument();
    });

    it('should update meta tag when edit form submitted', async () => {
      const user = userEvent.setup();
      render(<MetaTagConfig initValue={mockMetaTags} onChange={mockOnChange} />);

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Edit Meta Tag')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/Meta Tag Name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'updated-description');

      const updateButton = screen.getByRole('button', { name: 'Update Meta Tag' });
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({
              id: 'test-1',
              name: 'updated-description',
            }),
          ])
        );
      });
    });
  });

  describe('Delete Meta Tag', () => {
    it('should show confirmation dialog when delete clicked', async () => {
      const user = userEvent.setup();
      render(<MetaTagConfig initValue={mockMetaTags} />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      expect(screen.getByText('Delete this meta tag?')).toBeInTheDocument();
      expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    });

    it('should delete meta tag when confirmed', async () => {
      const user = userEvent.setup();
      render(<MetaTagConfig initValue={mockMetaTags} onChange={mockOnChange} />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      const confirmButton = screen.getByRole('button', { name: 'Delete' });
      await user.click(confirmButton);

      expect(mockOnChange).toHaveBeenCalledWith([mockMetaTags[1]]);
    });
  });

  describe('Save Configuration', () => {
    it('should call onSave when Save Configuration clicked', async () => {
      const user = userEvent.setup();
      render(<MetaTagConfig initValue={mockMetaTags} onSave={mockOnSave} />);

      const saveButton = screen.getByRole('button', { name: /Save Configuration/i });
      await user.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith(mockMetaTags);
    });

    it('should disable save button when no tags configured', () => {
      render(<MetaTagConfig initValue={[]} onSave={mockOnSave} />);

      const saveButton = screen.getByRole('button', { name: /Save Configuration/i });
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Controlled Component', () => {
    it('should use value prop when provided', () => {
      const { rerender } = render(<MetaTagConfig value={mockMetaTags} />);

      expect(screen.getByText('Page description')).toBeInTheDocument();
      expect(screen.getByText('Open Graph title')).toBeInTheDocument();

      const updatedTags = [mockMetaTags[0]];
      rerender(<MetaTagConfig value={updatedTags} />);

      expect(screen.getByText('Page description')).toBeInTheDocument();
      expect(screen.queryByText('Open Graph title')).not.toBeInTheDocument();
    });

    it('should call onChange when tags are modified', async () => {
      const user = userEvent.setup();
      render(<MetaTagConfig value={mockMetaTags} onChange={mockOnChange} />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      const confirmButton = screen.getByRole('button', { name: 'Delete' });
      await user.click(confirmButton);

      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('Help Section', () => {
    it('should render help section with tag types', () => {
      render(<MetaTagConfig initValue={[]} />);

      expect(screen.getByText('Help: Meta Tag Reference')).toBeInTheDocument();
      const helpSection = screen.getByText('Help: Meta Tag Reference').closest('.ant-card');
      expect(helpSection).toBeInTheDocument();
    });

    it('should render help section with attributes', () => {
      render(<MetaTagConfig initValue={[]} />);

      expect(screen.getByText('Help: Meta Tag Reference')).toBeInTheDocument();
      const codeElements = screen.getAllByText(/name|property|http-equiv|itemprop/).filter(
        (el) => el.tagName === 'CODE'
      );
      expect(codeElements.length).toBeGreaterThan(0);
    });
  });
});
