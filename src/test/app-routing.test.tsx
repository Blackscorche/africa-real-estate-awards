import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches all dedicated role dashboard routes", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const voterMatches = router.matchRoutes("/dashboard");
    expect(voterMatches.at(-1)?.routeId).toBe("/_authenticated/dashboard");

    const memberMatches = router.matchRoutes("/dashboard/member");
    expect(memberMatches.at(-1)?.routeId).toBe("/_authenticated/dashboard/member");

    const nomineeMatches = router.matchRoutes("/dashboard/nominee");
    expect(nomineeMatches.at(-1)?.routeId).toBe("/_authenticated/dashboard/nominee");

    const judgeMatches = router.matchRoutes("/dashboard/judge");
    expect(judgeMatches.at(-1)?.routeId).toBe("/_authenticated/dashboard/judge");
  });
});
