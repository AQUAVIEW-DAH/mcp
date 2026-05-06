# vhs script — generates assets/demo.gif from a real Claude Code session
# install: brew install vhs
# run:     vhs demo.tape

Output assets/demo.gif

Set FontSize 14
Set Width 1100
Set Height 640
Set Theme "Dracula"
Set TypingSpeed 35ms
Set PlaybackSpeed 1.0

# Add Aquaview to Claude Code
Type "claude mcp add --transport http aquaview https://mcp.aquaview.org/mcp"
Sleep 500ms
Enter
Sleep 1500ms

# Start a Claude Code session
Type "claude"
Sleep 300ms
Enter
Sleep 2s

# Ask the question
Type "Find Argo float profiles within 200 km of Hawaii in March 2026 where the float reached at least 1500 dbar pressure. Give me a few download links."
Sleep 800ms
Enter

# Let the response unfold — Claude calls aquaview tools and writes the answer
Sleep 14s

# Hold the final frame
Sleep 3s
