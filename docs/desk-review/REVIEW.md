# Previous desk with current content

The previously approved procedural desk scene is now restored around the approved real 3D TV. The environment builder reuses the original window, articulated lamp, console, controller/cable, laptop, books, notebook, cup and wall sketch. It excludes the previous placeholder TV body and captured front image. One renderer draws the desk and real TV throughout the approach and return.

Default entry / `#room` shows the wide desk. Enter moves toward the same television and reveals the projected HTML screen. Back to desk or the physical power control returns. Escape can reverse an approach; case Escape still returns to the collection. Direct project, profile and Atlas links bypass the wide view. Reduced motion skips the camera tween; startup WebGL failure retains the usable content fallback.

Verification: 49 unit tests and production build pass. The production eleven-project browser suite passes. The desk browser suite covers wide/close views at 1440/768/390, screen inert state until the camera has settled, reversal with Enter focus restoration, deep links and one physical renderer canvas; no runtime errors or missing local assets. Camera tests use numeric closeness for the initial zero position, avoiding an irrelevant signed-zero distinction. Production waits for both camera position and completion state rather than treating rounded tween progress as completion.

Screenshots in this directory were inspected. Independent read-only integration review found no actionable regressions and additionally verified browser Back/Forward, modal/index shortcut scope, focus and fallback. The current globe and project index remain the same components; no previous sample applications were reintroduced.
