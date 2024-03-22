# Finsweet Developer Starter

A starter template for both Client & Power projects.

This project contains some preconfigured development tools:

- [Typescript](https://www.typescriptlang.org/): A superset of Javascript that adds an additional layer of Typings, bringing more security and efficiency to the written code.
- [Prettier](https://prettier.io/): Code formating that assures consistency across all Finsweet's projects.
- [ESLint](https://eslint.org/): Code linting that enforces industries' best practises. It uses [our own custom configuration](https://github.com/finsweet/eslint-config) to maintain consistency across all Finsweet's projects.
- [ESBuild](https://esbuild.github.io/): Javascript bundler that compiles, bundles and minifies the original Typescript files.

Resources (work in progress):

- [How to start](#how-to-start)
- [Setting up a custom build directory](#setting-up-a-custom-build-directory)
- [Setting up a path alias](#setting-up-a-path-alias)

## How to start

The quickest way to start developing a new project is by [creating a new repository from this template](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template#creating-a-repository-from-a-template).

After that, open the new repository in your terminal and install the NPM packages by running:

```bash
npm install
```

To build the files, you have two defined scripts:

- `npm run build`: Will build to the production directory (`dist`).
- `npm run dev`: Will build and create a local server that serves all files (check [Serving files on development mode](#serving-files-on-development-mode) for more info).

## Serving files on development mode

When you run `npm run dev`, two things happen:

- ESBuild is set to `watch` mode. Every time that you save your files, the project will be rebuilt.
- A local server is created under `http://localhost:3000` that serves all your project files. You can import them in your Webflow projects like:

```html
<script src="http://localhost:3000/index.js"></script>
```

## Setting up a path alias

Path aliases are very helpful to avoid code like:

```typescript
import example from '../../../../utils/example';
```

Instead, we can create path aliases that map to a specific folder, so the code becomes cleaner like:

```typescript
import example from '$utils/example';
```

You can set up path aliases using the `paths` setting in `tsconfig.json`. This template has an already predefined path as an example:

```json
{
  "paths": {
    "$utils/*": ["src/utils/*"]
  }
}
```

To avoid any surprises, take some time to familiarize yourself with the [tsconfig](/tsconfig.json) enabled flags.

## Was es beim Implemetieren von LPs zu beachten gibt

Um nach Berfusfeld zu filtern - entsprechendes Tag in Recruitee hinzufügen.
Anschließned in der apiUtils.ts den gefetchten Datensatz vorfiltern, entsprechen des geüwnschten tags

wie z.B hier:

```typescript
// Zusätzliche Filterung, um nur Angebote anzuzeigen, die "test" als Tag haben
offers = offers.filter((offer) => offer.tags && offer.tags.includes('test'));
```

wichtig zu beachten, dass die neu hinzugefügten tags in den Filteroptionen entweder ausgefilter werden müssen - in der domUtils.ts:

```typescript
// Liste aller verbotenen Tags zum Filtern definieren
const forbiddenTags = ['test1'];
```

Wenn ein separter Block mit Filteropitionen aus den zusätzlichen Tags gebaurcht wird, muss das entsprechend im DOM in Webflow über das HTML angepasst werden - es sollte data-element="second-filter" für eine checkbox, die von einem div umgeben ist gesetzt werden.
Anschließend wird dann in der cms.ts definiert:

```typescript
// Create and append tag filters for the second set of tags, specifically those at index 1 from each offer
const seenSecondTags = new Set(); // Verwende ein Set, um doppelte Tags zu vermeiden
offers.forEach((offer) => {
  if (offer.tags && offer.tags.length > 1) {
    const secondTag = offer.tags[1]; // Nehme das zweite Tag aus jedem Angebot
    // Stelle sicher, dass dieses Tag noch nicht verarbeitet wurde
    if (!seenSecondTags.has(secondTag)) {
      const newSecondTagFilter = createFilter(secondTag, secondFiltersTagTemplateElement);
      if (newSecondTagFilter) {
        secondtagWrapperElement.append(newSecondTagFilter);
        seenSecondTags.add(secondTag); // Füge dieses Tag zum Set hinzu, um Duplikate zu vermeiden
      }
    }
  }
});
```

wichtig: wenn der code das Zweite Element Element data-element="second-filter" nicht findet, wird die Operation beendet. Also wenn das nicht nötig ist, muss das entsprechend im Code rausgenommen bzw. angepasst werden. Auch ein Eltern Wrapper der Filter Checkboxes muss gesetzt werden, denn auch hier gilt gleiches bezüglich der Fortfühtung der Operation.

Ansosnten muss aufgrund der Funktionalität der CMS Filter Library entsprechend ein Zweites Fitler FEld in der UI eingerichtet werden, an dem sich die Filterlogik orientiert. Dieses kann ggf. über CSS auf hidden gesetzt werden.
Hier die Anpassung im Code der domUtils.ts

```typescript
//Add second tag if exists
if (secondTagsContainer && offer.tags && offer.tags.length > 0) {
  const tagElement = document.createElement('span'); // Create a new span for the first tag
  tagElement.textContent = offer.tags[1]; // Set text content to the first tag
  secondTagsContainer.appendChild(tagElement); // Append the first tag element to the container
}
```
