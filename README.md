# PMR Keypress Aquarium

A fun browser toy for young children. Every key press spawns a colorful fish carrying that letter or symbol, swimming across an underwater scene. Let your kid bash away on the keyboard!

![Keypress Aquarium](assets/preview.gif)

## Features

- A new fish appears for every key pressed
- Each fish has a random color, size, and swimming speed
- The pressed key is displayed on the fish body
- Bubble sound effect on every key press
- Backspace removes the last typed character; Enter clears it
- A live display at the bottom shows what is being typed

## Running locally

No build step or dependencies required. Just open `index.html` in a browser, or serve it with any static file server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Live demo

Deployed at: https://pmrelvas.github.io/pmr-keypress-aquarium/

## License

[CC BY-NC 4.0](LICENSE) — free to share and adapt, but not for commercial use.
