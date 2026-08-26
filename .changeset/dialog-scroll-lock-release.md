---
'@foldkit/ui': patch
---

Release the Dialog scroll lock when the dialog element is already gone by the time `ShowDialog` or `CloseDialog` runs. `ShowDialog` takes the lock before it waits for the commit. When a navigation was processed before that commit, it removed the dialog while the dialog was still rendered closed. A closed dialog has no unmount handler, so nothing released the lock and the page stayed locked with no dialog open. Both Commands now release the lock on that failure instead of ignoring it. `ShowDialog` also releases it when the Command is interrupted while it waits for the commit.
