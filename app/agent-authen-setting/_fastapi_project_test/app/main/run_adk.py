"""
ADK Web Runner Script.

This script starts the Google ADK web interface with authentication support.
Run with: python -m app.main.run_adk
Or: adk web app.main
"""
import os
import sys

# Add the project root to the path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, project_root)


def main():
    """Run the ADK web interface."""
    from google.adk.cli import main as adk_main
    
    # Set the agent path
    os.environ.setdefault("ADK_AGENT_PATH", "app.main")
    
    # Run ADK web
    sys.argv = ["adk", "web", "app.main"]
    adk_main()


if __name__ == "__main__":
    main()
