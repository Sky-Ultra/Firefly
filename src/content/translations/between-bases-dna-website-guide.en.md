---
translationOf: between-bases-dna-website-guide.md
sourceHash: sha256:616ca380a50a1f6ff5b242984bf51182751fc05c8b36f680173a5918973c7925
---

This is a basic science education project built with Three.js. Although it is a simple showcase page, I have refined the website and adjusted its implementation over several rounds.

## DNA, genes, and chromosomes: first distinguish the levels

DNA is a molecule made of linked nucleotides. Each nucleotide contains a sugar, a phosphate group, and a base. A, T, G, and C identify the bases: adenine, thymine, guanine, and cytosine. In a typical DNA double strand, the sides form the sugar–phosphate backbones, while the bases pair inside: A with T, and G with C. The sequence strip shows only the bases, not complete nucleotides. [NHGRI's introduction to DNA](https://www.genome.gov/about-genomics/fact-sheets/Deoxyribonucleic-Acid-Fact-Sheet) helps clarify this relationship.

A gene is a region identified in terms of sequence and function. Protein-coding genes provide the sequence information needed to synthesize polypeptides; some other genes produce functional RNA. Treating every gene as “a recipe for a protein” leaves out the latter group. The later DNA→RNA→polypeptide experiment concerns protein-coding segments. [NHGRI: Gene](https://www.genome.gov/genetics-glossary/Gene)

Next, consider packaging in eukaryotic cells: DNA is organized with histones and other proteins into chromatin, of which the nucleosome is a basic organizational unit. The second exhibit shows how DNA wraps around a histone core. This structure covers a local region rather than an entire chromosome. [RCSB: 1AOI](https://www.rcsb.org/structure/1AOI)

The site's structural diagrams, gene-region diagrams, and nucleosome diagrams therefore have different scales of observation. `ScientificFigure.astro` indicates which images come from experimental coordinates and which are teaching schematics. The short DNA segment on the homepage is not labeled as a complete gene.

## The homepage double helix has a specific data source

Both models use experimental PDB structures. Their coordinates, structural metadata, and 2D projections are stored together in the project:

| Exhibit | What this structure contains | Experimental method and resolution |
| --- | --- | --- |
| [1BNA](https://www.rcsb.org/structure/1BNA) | Synthetic B-DNA: two strands of 12 nucleotides each, forming 12 base pairs | X-ray diffraction, 1.90 Å |
| [1AOI](https://www.rcsb.org/structure/1AOI) | DNA with 146 base pairs wrapped around a histone octamer | X-ray diffraction, 2.80 Å |

`bp` is the number of base pairs. Each of 1BNA's two strands has 12 nucleotides, giving 24 nucleotides and 12 bp. Each of 1AOI's two DNA strands has 146 nucleotides, paired into 146 bp. Its core contains two histone chains each of H2A, H2B, H3, and H4. These numbers describe their respective experimental systems, not the complete state of all DNA or nucleosomes.

Models are loaded with 3Dmol.js. `ModelViewer.tsx` passes the stored PDB text to the engine:

```ts
v.addModel(pdb, 'pdb');
atoms.current = v.selectedAtoms({hetflag:false});
```

It then sets display styles by chain, residue, and atom. The page offers ball-and-stick, space-filling, and structural overview modes. Ball-and-stick helps identify atoms and connections; space-filling helps compare occupied space; the overview simplifies the backbone and protein paths. Color is also an identification aid, switchable by chain, base, or element, rather than the molecule's true color.

Rotating the model changes the viewpoint. It does not calculate molecular dynamics or demonstrate how a double helix continually moves inside a cell. Hiding the nucleosome's protein components likewise only hides them from view; the button should not be interpreted as a real dissociation experiment.

## The direction of the complementary strand

DNA strands are antiparallel. The 5′ and 3′ labels come from the numbering of carbon atoms in the sugar and describe the strand's chemical direction. Rotating the diagram does not change that relationship. [OpenStax: DNA structure](https://openstax.org/books/biology-2e/pages/14-2-dna-structure-and-sequencing)

Consider a short sequence:

```text
输入链       5′-ATGC-3′
对齐的互补链 3′-TACG-5′
```

After pairing position by position, the lower strand runs 3′→5′ from left to right. To record it in the usual 5′→3′ order as well, it must be written starting from the other end:

```text
反向互补链   5′-GCAT-3′
```

Pairing and reversing the written order are separate operations. `src/lib/biology.mjs` implements them separately:

```js
export function complement(input) {
  const seq = normalizeSequence(input);
  const pairs = {A:'T', T:'A', G:'C', C:'G'};
  return [...seq].map(c => pairs[c]).join('');
}

export function reverseComplement(input) {
  return [...complement(input)].reverse().join('');
}
```

The lab shows the input, the aligned complementary strand, and the reverse complement together. Endpoint labels also follow the current writing direction. Looking only at the letters makes it easy to confuse `TACG` with `GCAT`; keeping 5′ and 3′ visible makes the reading direction of each line clear.

Input validation also happens before calculation. The page accepts 1–300 bases, removes whitespace, converts letters to a consistent case, then validates against DNA's `ATGC` or RNA's `AUGC`. Entering U in DNA mode clearly prompts the user to change the type or character, and an invalid result is not left on the right.

## Before transcription, specify which strand is being transcribed

During transcription, RNA polymerase synthesizes RNA using the DNA template strand. The template is read 3′→5′, and the new RNA extends 5′→3′. The coding strand and corresponding RNA have matching sequences when written in the same direction, except that DNA uses T and RNA uses U. [OpenStax: Transcription](https://openstax.org/books/biology-2e/pages/15-2-prokaryotic-transcription)

Thus, “replace T with U” has a prerequisite: the input must be a coding strand already written 5′→3′. A template strand also requires handling complementarity and direction.

The default teaching segment can be entered in several forms, all corresponding to the same RNA:

| Input identity | Written direction and sequence |
| --- | --- |
| Coding strand | `5′-ATGGCTGAATAA-3′` |
| Template strand, aligned by position | `3′-TACCGACTTATT-5′` |
| The same template strand, written 5′→3′ | `5′-TTATTCAGCCAT-3′` |
| Corresponding RNA | `5′-AUGGCUGAAUAA-3′` |

The part of `transcribe()` handling strand identity and direction is:

```js
if (identity === 'coding') {
  if (direction === 'reverse') seq = [...seq].reverse().join('');
  return seq.replaceAll('T', 'U');
}
if (direction === 'forward') seq = [...seq].reverse().join('');
return complement(seq).replaceAll('T', 'U');
```

In this function, `forward` means the input is written 5′→3′, while `reverse` means it is written 3′→5′. Output is consistently 5′→3′ RNA.

Strand identity and direction are independent interface states, retained when switching tabs. The basis for the calculation stays beside the input, making it easier to compare whether another written form of the same strand produces the same result.

This lab only converts corresponding sequences. It omits processes such as initiation, termination, and RNA processing. DNA remains the template, while RNA is a newly synthesized molecule; the arrows indicate how information is used.

## Why reading three letters at a time can produce different results

Translation reads mRNA in codons, each made of three nucleotides. Codons specify amino acids or a stop signal. Reading them in sequence determines the amino acid order. The website uses NCBI's Standard Genetic Code, table 1. [NCBI: The Genetic Codes](https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi#SG1)

The default segment groups as follows:

```text
编码 DNA  5′-ATG GCT GAA TAA-3′
RNA       5′-AUG GCU GAA UAA-3′
读取结果      M   A   E  Stop
```

M, A, and E are single-letter amino acid codes for methionine, alanine, and glutamate, respectively. UAA is a stop signal, not a fourth amino acid, so the teaching product has a length of 3.

`translate()` uses a `CODON_TABLE` containing all 64 triplets and looks them up group by group:

```js
for (let i = 0; i + 2 < seq.length; i += 3) {
  const codon = seq.slice(i, i + 3), aa = CODON_TABLE[codon];
  codons.push({codon, aa, position:i + 1});
  if (aa === '*') {
    result.stopPosition = i + 1;
    result.afterStop = seq.slice(i + 3);
    return result;
  }
  aminoAcids.push(aa);
}
```

`i + 2 < seq.length` ensures that only complete triplets are processed. A stop signal ends the current reading, with the remaining RNA stored separately in `afterStop`. If no stop is encountered and one or two bases remain, they are stored in `remainder` rather than forcibly completed.

The page also presets a reading frame: it must begin with AUG at RNA position 1. If position 1 does not contain AUG, the demonstration stops rather than silently searching for another starting point farther along. Real translation also involves conditions such as start-site recognition, and there are genetic codes outside the standard table and other initiation cases. Stating this restriction gives the code's results a clear meaning.

The interface's `SequenceLine` spaces RNA into groups of three and lists each codon's result below. Letter groups, position numbers, and the final product can be checked against one another rather than relying only on a final answer.

## What changes when a base changes, and where the change occurs

A sequence change can leave the coding result unchanged, replace an amino acid, cause an early stop, or change subsequent grouping. The website provides four fixed examples based on the default segment:

| Example | Coding DNA, grouped in the resulting reading frame | Product read by this model |
| --- | --- | --- |
| Original segment | `ATG GCT GAA TAA` | M–A–E |
| Position 6 T→C, synonymous | `ATG GCC GAA TAA` | M–A–E |
| Position 9 A→C, missense | `ATG GCT GAC TAA` | M–A–D |
| Position 7 G→T, nonsense | `ATG GCT TAA TAA` | M–A, followed by an early stop signal |
| Delete G at position 4 | `ATG CTG AAT AA` | M–L–N; trailing AA is not translated, and the segment contains no stop signal |

The synonymous example changes RNA's GCU to GCC, both of which still encode alanine. This illustrates how one amino acid can correspond to multiple codons. The missense example changes GAA to GAC, replacing glutamate E with aspartate D. Deleting one base changes triplet grouping after the deletion, demonstrating a frameshift. [MedlinePlus: Types of variants](https://medlineplus.gov/genetics/understanding/mutationsanddisorders/possiblemutations/)

The deletion example also retains two coordinate systems. When comparing the original and modified sequences, “−” occupies reference position 4 and the subsequent reference numbers stay fixed. Actual translation regroups the continuous sequence after deletion. The first representation answers “where did the original change?” and the second answers “how is it read now?”

The code calculates the modified result through the existing `translate()` function. The variant panel does not have a separate set of translation rules, allowing cross-checks between the sequence and variant tabs.

These comparisons concern the coding output of a teaching segment. Synonymous does not mean there can be no other effects in a real organism, and the label missense alone cannot establish pathogenicity. The page does not directly convert a few changed letters into a disease or physical trait.

## Why replication is continuous on one side and segmented on the other

The earlier transcription process produces RNA, while DNA replication synthesizes new DNA. Semiconservative replication means that each completed double-stranded product contains one parental strand and one newly synthesized strand. [OpenStax: Semiconservative replication](https://openstax.org/books/biology-2e/pages/14-3-basics-of-dna-replication)

Understanding leading and lagging strands requires two rules together: the templates are antiparallel, and DNA polymerase can add nucleotides only to the growing strand's 3′ end, extending the new strand 5′→3′. At the same replication fork, one side can therefore synthesize continuously in the fork's direction of travel. The other must start repeatedly, first making Okazaki fragments and then processing and joining them. [OpenStax: The replication fork and Okazaki fragments](https://openstax.org/books/biology-2e/pages/14-4-dna-replication-in-prokaryotes)

Every new fragment on the lagging strand is also synthesized 5′→3′. Different left- and right-pointing arrows in the diagram do not mean that either new strand is synthesized 3′→5′.

The project explains this through six discrete steps:

1. Identify the two parental strands.
2. Separate them locally to form a replication fork.
3. Use primers as starting points for new-strand extension.
4. Extend the leading strand continuously and the lagging strand in segments.
5. Process primers, fill gaps, and join fragments.
6. Show two products, each containing one old strand and one new strand.

`ReplicationLab` uses `useReducer` to manage the current step, playback state, and speed. Part of the state transition logic is:

```ts
case 'pause':return {...state,playing:false};
case 'speed':return {...state,speed:[.5,1,2].includes(action.value)?action.value:state.speed};
case 'next':return {...state,step:Math.min(5,state.step+1),playing:false};
case 'previous':return {...state,step:Math.max(0,state.step-1),playing:false};
case 'jump':return {...state,step:Math.min(5,Math.max(0,action.value)),playing:false};
case 'tick':return state.playing?{...state,step:Math.min(5,state.step+1),playing:state.step<4}:state;
```

The step range is fixed at 0–5. Pausing and changing speed preserve the current biological step; next, previous, and direct jumps end autoplay. Playback stops at the final product diagram.

Autoplay advances one step every `2800 / state.speed` milliseconds. This value controls presentation pacing; intervals between the six steps do not represent equal amounts of actual biological time.

The diagrams use SVG paths and arrows. Brown denotes parental strands, green denotes new DNA, and short segments mark RNA primers. Narrow screens use a separate `MobileReplicationDiagram`, rearranging labels and paths while preserving the same strand directions and step relationships.

## A one-in-four probability does not require one occurrence every four trials

The inheritance lab uses a fictional diploid, single-gene model: one locus, two alleles A and a, and each parent represented as AA, Aa, or aa. Under assumptions such as normal segregation, half the gametes from an Aa parent carry A and half carry a. Here, A and a are allele symbols, distinct from the A representing adenine in DNA sequences.

The four combinations for Aa×Aa are:

| Parent A's gamete \ Parent B's gamete | A | a |
| --- | --- | --- |
| A | AA | Aa |
| a | Aa | aa |

Each cell has probability 1/4. Combining the two Aa cells gives theoretical probabilities of 25%, 50%, and 25% for AA, Aa, and aa. Compare this derivation with [OpenStax's explanation of monohybrid crosses](https://openstax.org/books/biology-2e/pages/12-2-characteristics-and-traits).

`inheritance()` directly enumerates the four combinations:

```js
export function inheritance(parentA, parentB) {
  if (!['AA','Aa','aa'].includes(parentA) || !['AA','Aa','aa'].includes(parentB))
    throw new Error('请选择 AA、Aa 或 aa。');
  const probabilities = {AA:0,Aa:0,aa:0}, cells = [];
  for (const a of parentA) for (const b of parentB) {
    const genotype = [a,b].sort().join('');
    probabilities[genotype] += .25;
    cells.push({a,b,genotype});
  }
  return {probabilities,cells};
}
```

Sorting combines `aA` and `Aa` into the same genotype. AA×aa still enumerates four gamete slots, but all four cells become Aa, producing 100% Aa.

“Draw once,” “Draw 20 more,” and “Draw 1000” separately invoke random sampling. Each trial uses a random number to determine which probability interval it falls into:

```ts
const draw = random();
const genotype = draw < probabilities.AA ? 'AA'
  : draw < probabilities.AA + probabilities.Aa ? 'Aa' : 'aa';
result[genotype]++;
```

The page plots theoretical probability and cumulative frequency side by side. With few trials, frequency can deviate noticeably. More sampling will usually bring it closer to the theoretical probability, but each added batch is not guaranteed to make it closer. Several aa outcomes do not require the next trial to produce another genotype to “restore the ratio.”

Changing the parents clears the sampling counts and recalculates theoretical probabilities. Trials under the old conditions are not mixed into the new experiment.

The default panel first shows genotypes. Only after enabling the complete-dominance model are AA and Aa combined into the same phenotype, giving a 3:1 ratio under that condition. Dominance describes a relationship between alleles and phenotype; it does not mean that an allele must be more common, superior, or more readily inherited. [NHGRI: Dominant](https://www.genome.gov/genetics-glossary/Dominant)

A and a are not assigned to actual human traits here. The model excludes complex traits, linkage, selection, and penetrance, and the four-cell calculation is not intended to make real health judgments.

## Model selection depends on chains and identifiers

After understanding pairing, consider how the 3D model and 2D sequence stay synchronized. `models.json` stores chains, residues, and author-assigned identifiers. Clicking a sequence button passes the same chain and number to 3D highlighting.

In 1BNA, author chain A uses residue numbers 1–12 and author chain B uses 13–24. In this structure, A's residue n therefore pairs with B's residue 25−n. Selecting A:5 also highlights B:20:

```ts
const paired = {
  chain:selection.chain === 'A' ? 'B' : 'A',
  resi:25 - selection.resi
};
```

This calculation depends on 1BNA's specific numbering. Another PDB file may use different residue numbers and chain labels, requiring its mapping to be read again.

1AOI retains two sets of chain names:

| Component | Author chain `auth` | Standard label chain `label` |
| --- | --- | --- |
| First DNA strand | I | A |
| Second DNA strand | J | B |
| One H3 histone | A | C |

In this structure, “chain A” alone is insufficient: author chain A is protein, whereas label chain A is DNA. The selected-region panel shows both names together with residue numbers, preventing reference lookup and model interaction from pointing to different objects. This mapping can also be checked in [RCSB's 1AOI record](https://www.rcsb.org/structure/1AOI).

The homepage sequence is palindromic in the DNA sense: `CGCGAATTCGCG` gives the same string after reverse complementation. Writing both strands in their own 5′→3′ directions produces identical letters, while their directions remain opposite. Observation tasks therefore guide readers to examine both endpoint labels and positions in the structure.

## How the 3D preview loads

Astro generates static HTML, and React handles interactive parts. The homepage, articles, glossary entries, and sources can first be read as ordinary pages; the sequence lab, models, search, and reading markers then connect to browser state.

On the experiment page, this line lets React take over the lab after page load:

```astro
<SequenceLab client:load/>
```

Questions after the article use `client:visible`, activating only when scrolled near. Static content and interactive sections therefore load at different times; a long article does not need to initialize every control immediately.

The 3D component adds another layer. The React exhibit shell initially shows a 2D projection. `HeroExhibit.tsx` renders the dynamically imported viewer only after a click:

```tsx
const Viewer = lazy(() => import('./ModelViewer'));
```

Only when the viewer starts does it load the local `/vendor/3Dmol-min.js` and read the PDB. React controls being able to respond to clicks and the heavyweight molecular engine being loaded are separate things.

The 2D projection also comes from the same structural snapshot. `prepare-models.mjs` reads the PDB coordinate columns:

```js
x:+l.slice(30,38),y:+l.slice(38,46),z:+l.slice(46,54)
```

It then rotates, projects, and generates SVG. The nucleosome preview simplifies DNA and protein paths, and the page states that simplification. If 3D cannot start, the preview, sequence, and component descriptions remain, allowing readers to inspect positions.

## Operate the model, then return to ordinary reading

On a phone, scrolling past a model can easily send gestures to the canvas instead. This project first shows an “Operate model” button, accepts touch input only after explicitly entering that mode, and provides “Exit interaction and continue scrolling.” Long sequences scroll horizontally within a local container without widening the whole page.

Viewer initialization and cleanup live in React's `useEffect`. Closing aborts pending requests, disconnects resize observation, and clears models, shapes, labels, and the canvas. Late asynchronous responses first check whether that viewer generation is still valid.

Some global events registered during construction by the current 3Dmol.js version are separately tracked by `createManagedViewer()` and removed when that viewer closes. Repeated opening and closing should not leave several sets of model listeners responding afterward.

Wheel zoom is also handled separately. The function converts deltas from different wheel units into `px`, then calculates the factor:

```js
return Math.exp(-Math.max(-160,Math.min(160,px))*.0018)
```

An upward scroll's negative delta produces a factor greater than 1, while a downward scroll produces one below 1; equal opposite deltas cancel. Buttons and arrow keys provide another way to operate the model, so observation does not depend on precise mouse dragging.

## Connecting articles, terminology, and sources

Text lives in `src/content/articles/`. Each Markdown article includes an identifier, topic, prerequisites, related content, figure types, questions, and source identifiers. Astro generates individual URLs from `slug`, while article tables of contents come from second-level headings.

The project's data and features can be located through these entry points:

| File or directory | Purpose |
| --- | --- |
| `src/content/articles/` | 24 Markdown articles and metadata |
| `src/data/topics.json`, `paths.json` | 12 topics and 4 reading paths |
| `src/data/glossary.json`, `sources.json` | 60 terms and 35 source records |
| `src/data/models.json`, `public/models/` | Manifests, mappings, and raw files for the two structures |
| `src/lib/biology.mjs` | Pairing, reverse complementation, transcription, translation, and theoretical inheritance probabilities |
| `src/components/Labs.tsx` | State and display for the three labs |
| `src/components/ModelViewer.tsx` | Structure display, selection, observation tasks, and fallbacks |
| `src/components/ScientificFigure.astro` | Structural projections and teaching diagrams within articles |
| `src/lib/search.mjs`, `storage.ts` | Local search and reading records |
| `scripts/validate-content.mjs` | Content, source associations, and structural snapshot checks |

Some terms in the text become buttons that open definitions in place. The script prioritizes longer terms, handles each term only once, inserts at most twelve entry points, and skips links, code, and headings. Readers can check a definition and then return to the same paragraph.

Search puts articles, terms, models, and experiments into one index. Chinese questions are segmented and stripped of common filler words, then require all meaningful terms to match. Title matches add 50 points, alias matches 25, and ordinary body matches 3; a complete query appearing in a title adds further points. Searching “DNA 和基因” is therefore more likely to find articles directly discussing that distinction.

Saved items and “Finished reading” records stay on the device under `between-bases-v1`. When storage is disabled or a write fails, the current page retains in-memory state and warns that it will be lost on closing. Sequence input and inheritance sampling are calculated only on the current page and are not added to reading records.

## Correct calculations still need an explanation of their basis

This kind of website requires two separate checks. Tests can verify whether a function correctly computes a complementary sequence or stops at a termination signal. Whether an explanation omits important conditions, or whether its citations support a conclusion, still requires consulting sources.

The project's 31 tests cover the standard codon table, several transcription inputs, stops and trailing bases, nine parental combinations, model-chain mappings, search, storage, and viewer cleanup. This version was run locally, and all 31 passed. Content checks also verify article associations, source identifiers, and structural snapshots.

Source data stores more than links: it records the scope of support, limitations, access dates, and verification status. Structure files retain SHA-256 hashes to identify the snapshot being read. A hash can check whether a file has changed, but cannot replace judgment about the scientific explanation.

Article metadata also distinguishes editorial checks from professional review:

```yaml
status: published
review_status: editorial_checked
published_at: "2026-10-17"
updated_at: "2026-10-17"
scientific_reviewed_by: null
scientific_reviewed_at: null
```

Here, `editorial_checked` means editorial checking has been completed, while the professional-review fields remain empty. Some NCBI textbook pages were limited by access verification. The source page records how far checking actually proceeded, without presenting a directory or index check as a full-text review.

Later article changes need coordinated checks of the body's `source_ids`, actual citations, related articles, and questions. Model updates also need chain names, residue numbering, assemblies, and 2D projections checked. `biology.mjs`, the experiment interface, and the explanatory text should be maintained together so the rules readers encounter in an article match the results they calculate themselves.

That is all.
Sky.
