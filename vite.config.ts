import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      {
        name: "mock-asset-resolver",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && req.url.includes("/__l5e/assets-v1/")) {
              const url = req.url;
              let target = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80";
              if (url.includes("gala-rooftop")) target = "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1600&q=80";
              else if (url.includes("institute-training")) target = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80";
              else if (url.includes("lekki-skyline")) target = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80";
              else if (url.includes("lagos-apartments")) target = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80";
              else if (url.includes("keys-mortgage")) target = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";
              else if (url.includes("green-tower-nairobi")) target = "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=80";
              else if (url.includes("magazine-cover") || url.includes("cover-issue-11") || url.includes("cover-issue-10")) target = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80";
              else if (url.includes("profile-adaeze")) target = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80";
              else if (url.includes("profile-kwame")) target = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80";
              else if (url.includes("profile-zanele")) target = "https://images.unsplash.com/photo-1580894732454-d677e43e60b4?auto=format&fit=crop&w=800&q=80";
              
              res.writeHead(302, { Location: target });
              res.end();
              return;
            }
            next();
          });
        },
      },
    ],
  },
});
