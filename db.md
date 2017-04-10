## DB Object

The goal is to create an object proxy which synchronously updates the file-system as it's properties are updated.
Ostensibly, this should allow caching and a more native feel to the data-source.
However, this is problematic because it's not straight-forward how to pull apart the `target` symbol into a dot-path string...
