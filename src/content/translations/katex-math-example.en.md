---
translationOf: katex-math-example.md
sourceHash: sha256:f349d341faac3e9f097761565a2161d35f28b4c12a2253252a08d3c927e5ee39
---

This post shows how the site renders mathematical notation with KaTeX.

## Inline formulas

Wrap an inline formula in a single pair of `$` delimiters.

For example, Euler's identity $e^{i\pi} + 1 = 0$ is often considered one of the most beautiful formulas in mathematics.

The mass-energy equivalence formula $E = mc^2$ is also widely recognised.

## Block formulas

Wrap a block formula in two `$$` delimiters. It will be centred on its own line.

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

## More complex examples

### Matrices

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
\alpha & \beta \\
\gamma & \delta
\end{pmatrix} =
\begin{pmatrix}
a\alpha + b\gamma & a\beta + b\delta \\
c\alpha + d\gamma & c\beta + d\delta
\end{pmatrix}
$$

### Limits and sums

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$

### Maxwell's equations

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\varepsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

### Chemical equations

$$
\ce{CH4 + 2O2 -> CO2 + 2H2O}
$$

## More symbols

| Symbol | Code | Rendered result |
| :--- | :--- | :--- |
| Alpha | `\alpha` | $\alpha$ |
| Beta | `\beta` | $\beta$ |
| Gamma | `\Gamma` | $\Gamma$ |
| Pi | `\pi` | $\pi$ |
| Infinity | `\infty` | $\infty$ |
| Right Arrow | `\rightarrow` | $\rightarrow$ |
| Partial | `\partial` | $\partial$ |

See [KaTeX Supported Functions](https://katex.org/docs/supported.html) for the rest of the syntax.
