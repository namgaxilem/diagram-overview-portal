import Header from "./components/Header";
import Hero from "./components/Hero";
import SystemArchitecture from "./components/SystemArchitecture";
import Features from "./components/Features";
import Footer from "./components/Footer";
import { Card, Button } from "antd";
import Link from "next/link";

export default function Home() {
  const routes = [
    {
      path: "/agent-detail-page",
      title: "Agent Detail Page",
      description: "Complete agent management interface with tabs, configuration, and monitoring"
    },
    {
      path: "/k8s-client",
      title: "Kubernetes Client",
      description: "Full kubectl UI for managing Kubernetes resources, pods, deployments, and more"
    },
    {
      path: "/diagram-v4",
      title: "Architecture Diagram V4",
      description: "Interactive system architecture visualization and diagram tool"
    },
    {
      path: "/agent-authen-setting",
      title: "Agent Authentication Settings",
      description: "Configure authentication settings for agents including ForgeRock integration"
    },
    {
      path: "/agent-output-schema",
      title: "Agent Output Schema Builder",
      description: "Visual builder for defining agent output schemas with JSON preview"
    },
    {
      path: "/agent-policy-config-builder",
      title: "Agent Policy Config Builder",
      description: "Policy configuration builder for agent behavior and governance rules"
    }
  ];

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      
      {/* Navigation Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Available Pages & Features
          </h2>
          <p className="block text-center text-gray-600 mb-12">
            Explore all the available tools and interfaces in the DHP AI Experience Hub
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <Card
                key={route.path}
                hoverable
                className="h-full"
                actions={[
                  <Link href={route.path} key="navigate">
                    <Button type="primary" block>
                      Open Page
                    </Button>
                  </Link>
                ]}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{route.title}</h3>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {route.path}
                    </code>
                  </div>
                  <p className="text-gray-600">{route.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <SystemArchitecture />
      <Features />
      <Footer />
    </main>
  );
}
