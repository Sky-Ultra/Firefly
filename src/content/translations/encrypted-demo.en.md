---
translationOf: encrypted-demo.md
sourceHash: sha256:0ead233b35d3937ae0816c3bc13fa4b94f2c41de412e5fff68f16b90afa0b091
---

## This post has been unlocked

If you can read this, the password was correct and the post was decrypted successfully.

### How it works

- **Encryption at build time**: The article is encrypted with AES-256-GCM while the site is built. No readable copy is left in the page source.
- **Decryption in the browser**: After a visitor enters the right password, the browser decrypts the article locally through the Web Crypto API.
- **Session cache**: The password is kept in `sessionStorage` for the current browser session, so refreshing the page does not prompt for it again.
- **Cleared on close**: Closing the browser clears that cache. The password is required again on the next visit.

> The password is `123456`. It is only for testing.

## Image

![Firefly](./images/1.avif)

## GitHub repository card

::github{repo="CuteLeaf/Firefly"}

## Callouts

> [!NOTE] NOTE
> Information the reader should take into account.

> [!TIP] TIP
> Optional information that may make the task easier.

> [!NOTE] Custom title
> This is an example with a custom title.

## Mathematical formulas
### Inline formulas

Euler's identity $e^{i\pi} + 1 = 0$ is often considered one of the most beautiful formulas in mathematics.

The mass-energy equivalence formula $E = mc^2$ is just as well known.

### Block formulas

Block formulas are wrapped in two `$$` delimiters and displayed in the centre.

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

### Chemical equations

$$
\ce{CH4 + 2O2 -> CO2 + 2H2O}
$$

## Code blocks
#### Standard syntax highlighting

```js
console.log('此代码有语法高亮!')
```

#### Rendering ANSI escape sequences

```ansi
ANSI colors:
- Regular: [31mRed[0m [32mGreen[0m [33mYellow[0m [34mBlue[0m [35mMagenta[0m [36mCyan[0m
- Bold:    [1;31mRed[0m [1;32mGreen[0m [1;33mYellow[0m [1;34mBlue[0m [1;35mMagenta[0m [1;36mCyan[0m
- Dimmed:  [2;31mRed[0m [2;32mGreen[0m [2;33mYellow[0m [2;34mBlue[0m [2;35mMagenta[0m [2;36mCyan[0m

256 colors (showing colors 160-177):
[38;5;160m160 [38;5;161m161 [38;5;162m162 [38;5;163m163 [38;5;164m164 [38;5;165m165[0m
[38;5;166m166 [38;5;167m167 [38;5;168m168 [38;5;169m169 [38;5;170m170 [38;5;171m171[0m
[38;5;172m172 [38;5;173m173 [38;5;174m174 [38;5;175m175 [38;5;176m176 [38;5;177m177[0m

Full RGB colors:
[38;2;34;139;34mForestGreen - RGB(34, 139, 34)[0m

Text formatting: [1mBold[0m [2mDimmed[0m [3mItalic[0m [4mUnderline[0m
```


## Flowchart

```mermaid
graph TD
    A[开始] --> B{条件检查}
    B -->|是| C[处理步骤 1]
    B -->|否| D[处理步骤 2]
    C --> E[子过程]
    D --> E
    subgraph E [子过程详情]
        E1[子步骤 1] --> E2[子步骤 2]
        E2 --> E3[子步骤 3]
    end
    E --> F{另一个决策}
    F -->|选项 1| G[结果 1]
    F -->|选项 2| H[结果 2]
    F -->|选项 3| I[结果 3]
    G --> J[结束]
    H --> J
    I --> J
```
