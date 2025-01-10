import { Conditional, DocsContextProps, PreparedStory, ModuleExports, Renderer as Renderer$1, Args as Args$1, StoryId, ModuleExport, ResolvedModuleExportType, ResolvedModuleExportFromType, Parameters as Parameters$1, ProjectAnnotations, BaseAnnotations, ComponentTitle } from 'storybook/internal/types';
export { DocsContextProps } from 'storybook/internal/types';
import * as React from 'react';
import React__default, { ComponentProps, FunctionComponent, ReactNode, FC, PropsWithChildren, Context, ReactElement } from 'react';
import { PropDescriptor } from 'storybook/internal/preview-api';
import { Renderer } from '@storybook/csf';
import { SupportedLanguage, SyntaxHighlighter, ActionItem, SyntaxHighlighterFormatTypes } from 'storybook/internal/components';
import { SourceType } from 'storybook/internal/docs-tools';
import { ThemeVars } from 'storybook/internal/theming';

declare enum SourceError {
    NO_STORY = "There\u2019s no story here.",
    SOURCE_UNAVAILABLE = "Oh no! The source is not available."
}
interface SourceCodeProps {
    /** The language the syntax highlighter uses for your story’s code */
    language?: SupportedLanguage;
    /** Use this to override the content of the source block. */
    code?: string;
    /** The (prettier) formatter the syntax highlighter uses for your story’s code. */
    format?: ComponentProps<typeof SyntaxHighlighter>['format'];
    /** Display the source snippet in a dark mode. */
    dark?: boolean;
}
interface SourceProps$1 extends SourceCodeProps {
    isLoading?: boolean;
    error?: SourceError;
}
/** Syntax-highlighted source code for a component (or anything!) */
declare const Source$1: FunctionComponent<SourceProps$1>;

interface PreviewProps {
    isLoading?: true;
    layout?: Layout;
    isColumn?: boolean;
    columns?: number;
    withSource?: SourceProps$1;
    isExpanded?: boolean;
    withToolbar?: boolean;
    className?: string;
    additionalActions?: ActionItem[];
    children?: ReactNode;
}
type Layout = 'padded' | 'fullscreen' | 'centered';

interface ArgType {
    name?: string;
    description?: string;
    defaultValue?: any;
    if?: Conditional;
    table?: {
        category?: string;
        disable?: boolean;
        subcategory?: string;
        defaultValue?: {
            summary?: string;
            detail?: string;
        };
        type?: {
            summary?: string;
            detail?: string;
        };
        readonly?: boolean;
        [key: string]: any;
    };
    [key: string]: any;
}
interface ArgTypes$1 {
    [key: string]: ArgType;
}
interface Args {
    [key: string]: any;
}
type Globals = {
    [name: string]: any;
};

declare enum ArgsTableError {
    NO_COMPONENT = "No component found.",
    ARGS_UNSUPPORTED = "Args unsupported. See Args documentation for your framework."
}
type SortType = 'alpha' | 'requiredFirst' | 'none';
interface ArgsTableOptionProps {
    children?: React__default.ReactNode;
    updateArgs?: (args: Args) => void;
    resetArgs?: (argNames?: string[]) => void;
    compact?: boolean;
    inAddonPanel?: boolean;
    initialExpandedArgs?: boolean;
    isLoading?: boolean;
    sort?: SortType;
}
interface ArgsTableDataProps {
    rows: ArgTypes$1;
    args?: Args;
    globals?: Globals;
}
interface ArgsTableErrorProps {
    error: ArgsTableError;
}
interface ArgsTableLoadingProps {
    isLoading: boolean;
}
type ArgsTableProps = ArgsTableOptionProps & (ArgsTableDataProps | ArgsTableErrorProps | ArgsTableLoadingProps);
/**
 * Display the props for a component as a props table. Each row is a collection of ArgDefs, usually
 * derived from docgen info for the component.
 */
declare const ArgsTable: FC<ArgsTableProps>;

interface CommonProps {
    story: PreparedStory;
    inline: boolean;
    primary: boolean;
}
interface InlineStoryProps extends CommonProps {
    inline: true;
    height?: string;
    autoplay: boolean;
    forceInitialArgs: boolean;
    renderStoryToElement: DocsContextProps['renderStoryToElement'];
}
interface IFrameStoryProps extends CommonProps {
    inline: false;
    height: string;
}
type StoryProps$1 = InlineStoryProps | IFrameStoryProps;
declare const Story$1: FunctionComponent<StoryProps$1>;

interface TypesetProps {
    fontFamily?: string;
    fontSizes: (string | number)[];
    fontWeight?: number;
    sampleText?: string;
}
/**
 * Convenient styleguide documentation showing examples of type with different sizes and weights and
 * configurable sample text.
 */
declare const Typeset: FC<TypesetProps>;

type Colors = string[] | {
    [key: string]: string;
};
interface ColorItemProps {
    title: string;
    subtitle: string;
    colors: Colors;
}
/**
 * A single color row your styleguide showing title, subtitle and one or more colors, used as a
 * child of `ColorPalette`.
 */
declare const ColorItem: FunctionComponent<ColorItemProps>;
interface ColorPaletteProps {
    children?: React__default.ReactNode;
}
/**
 * Styleguide documentation for colors, including names, captions, and color swatches, all specified
 * as `ColorItem` children of this wrapper component.
 */
declare const ColorPalette: FunctionComponent<ColorPaletteProps>;

interface IconItemProps {
    name: string;
    children?: React__default.ReactNode;
}
/** An individual icon with a caption and an example (passed as `children`). */
declare const IconItem: FunctionComponent<IconItemProps>;
interface IconGalleryProps {
    children?: React__default.ReactNode;
}
/** Show a grid of icons, as specified by `IconItem`. */
declare const IconGallery: FunctionComponent<IconGalleryProps>;

declare const anchorBlockIdFromId: (storyId: string) => string;
interface AnchorProps {
    storyId: string;
}
declare const Anchor: FC<PropsWithChildren<AnchorProps>>;

type ArgTypesParameters = {
    include?: PropDescriptor;
    exclude?: PropDescriptor;
    sort?: SortType;
};
type ArgTypesProps = ArgTypesParameters & {
    of?: Renderer['component'] | ModuleExports;
};
declare const ArgTypes: FC<ArgTypesProps>;

declare const DocsContext: Context<DocsContextProps<Renderer$1>>;

type ArgsHash = string;
declare function argsHash(args: Args$1): ArgsHash;
interface SourceItem {
    code: string;
    format?: SyntaxHighlighterFormatTypes;
}
type StorySources = Record<StoryId, Record<ArgsHash, SourceItem>>;
interface SourceContextProps {
    sources: StorySources;
    setSource?: (id: StoryId, item: SourceItem) => void;
}
declare const SourceContext: Context<SourceContextProps>;
declare const UNKNOWN_ARGS_HASH = "--unknown--";
declare const SourceContainer: FC<PropsWithChildren<{
    channel: DocsContextProps['channel'];
}>>;

type SourceParameters = SourceCodeProps & {
    /** Where to read the source code from, see `SourceType` */
    type?: SourceType;
    /** Transform the detected source for display */
    transform?: (code: string, storyContext: ReturnType<DocsContextProps['getStoryContext']>) => string;
    /** Internal: set by our CSF loader (`enrichCsf` in `@storybook/csf-tools`). */
    originalSource?: string;
};
type SourceProps = SourceParameters & {
    /**
     * Pass the export defining a story to render its source
     *
     * ```jsx
     * import { Source } from '@storybook/blocks';
     * import * as ButtonStories from './Button.stories';
     *
     * <Source of={ButtonStories.Primary} />;
     * ```
     */
    of?: ModuleExport;
    /** Internal prop to control if a story re-renders on args updates */
    __forceInitialArgs?: boolean;
};
type PureSourceProps = ComponentProps<typeof Source$1>;
declare const useSourceProps: (props: SourceProps, docsContext: DocsContextProps<any>, sourceContext: SourceContextProps) => PureSourceProps;
/**
 * Story source doc block renders source code if provided, or the source for a story if `storyId` is
 * provided, or the source for the current story if nothing is provided.
 */
declare const Source: FC<SourceProps>;

type PureStoryProps = ComponentProps<typeof Story$1>;
/** Props to reference another story */
type StoryRefProps = {
    /**
     * Pass the export defining a story to render that story
     *
     * ```jsx
     * import { Meta, Story } from '@storybook/blocks';
     * import * as ButtonStories from './Button.stories';
     *
     * <Meta of={ButtonStories} />
     * <Story of={ButtonStories.Primary} />
     * ```
     */
    of?: ModuleExport;
    /**
     * Pass all exports of the CSF file if this MDX file is unattached
     *
     * ```jsx
     * import { Story } from '@storybook/blocks';
     * import * as ButtonStories from './Button.stories';
     *
     * <Story of={ButtonStories.Primary} meta={ButtonStories} />;
     * ```
     */
    meta?: ModuleExports;
};
type StoryParameters = {
    /** Render the story inline or in an iframe */
    inline?: boolean;
    /** When rendering in an iframe (`inline={false}`), set the story height */
    height?: string;
    /** Whether to run the story's play function */
    autoplay?: boolean;
    /** Internal prop to control if a story re-renders on args updates */
    __forceInitialArgs?: boolean;
    /** Internal prop if this story is the primary story */
    __primary?: boolean;
};
type StoryProps = StoryRefProps & StoryParameters;
declare const getStoryId: (props: StoryProps, context: DocsContextProps) => StoryId;
declare const getStoryProps: <TFramework extends Renderer$1>(props: StoryParameters, story: PreparedStory<TFramework>, context: DocsContextProps<TFramework>) => PureStoryProps;
declare const Story: FC<StoryProps>;

type CanvasProps = Pick<PreviewProps, 'withToolbar' | 'additionalActions' | 'className'> & {
    /**
     * Pass the export defining a story to render that story
     *
     * ```jsx
     * import { Meta, Canvas } from '@storybook/blocks';
     * import * as ButtonStories from './Button.stories';
     *
     * <Meta of={ButtonStories} />
     * <Canvas of={ButtonStories.Primary} />
     * ```
     */
    of?: ModuleExport;
    /**
     * Pass all exports of the CSF file if this MDX file is unattached
     *
     * ```jsx
     * import { Canvas } from '@storybook/blocks';
     * import * as ButtonStories from './Button.stories';
     *
     * <Canvas of={ButtonStories.Primary} meta={ButtonStories} />;
     * ```
     */
    meta?: ModuleExports;
    /**
     * Specify the initial state of the source panel hidden: the source panel is hidden by default
     * shown: the source panel is shown by default none: the source panel is not available and the
     * button to show it is hidden
     *
     * @default 'hidden'
     */
    sourceState?: 'hidden' | 'shown' | 'none';
    /**
     * How to layout the story within the canvas padded: the story has padding within the canvas
     * fullscreen: the story is rendered edge to edge within the canvas centered: the story is
     * centered within the canvas
     *
     * @default 'padded'
     */
    layout?: Layout;
    /** @see {SourceProps} */
    source?: Omit<SourceProps, 'dark'>;
    /** @see {StoryProps} */
    story?: Pick<StoryProps, 'inline' | 'height' | 'autoplay' | '__forceInitialArgs' | '__primary'>;
};
declare const Canvas: FC<CanvasProps>;

type ControlsParameters = {
    include?: PropDescriptor;
    exclude?: PropDescriptor;
    sort?: SortType;
};
type ControlsProps = ControlsParameters & {
    of?: Renderer['component'] | ModuleExports;
};
declare const Controls: FC<ControlsProps>;

type Of = Parameters<DocsContextProps['resolveOf']>[0];
/**
 * A hook to resolve the `of` prop passed to a block. will return the resolved module if the
 * resolved module is a meta it will include a preparedMeta property similar to a preparedStory if
 * the resolved module is a component it will include the project annotations
 */
declare const useOf: <TType extends ResolvedModuleExportType>(moduleExportOrType: Of, validTypes?: TType[]) => ResolvedModuleExportFromType<TType>;

declare enum DescriptionType {
    INFO = "info",
    NOTES = "notes",
    DOCGEN = "docgen",
    AUTO = "auto"
}
interface DescriptionProps {
    /**
     * Specify where to get the description from. Can be a component, a CSF file or a story. If not
     * specified, the description will be extracted from the meta of the attached CSF file.
     */
    of?: Of;
}
declare const DescriptionContainer: FC<DescriptionProps>;

type DocsProps<TRenderer extends Renderer$1 = Renderer$1> = {
    docsParameter: Parameters$1;
    context: DocsContextProps<TRenderer>;
};
declare function Docs<TRenderer extends Renderer$1 = Renderer$1>({ context, docsParameter, }: DocsProps<TRenderer>): React__default.JSX.Element;

declare const DocsPage: FC;

interface DocsContainerProps<TFramework extends Renderer$1 = Renderer$1> {
    context: DocsContextProps<TFramework>;
    theme?: ThemeVars;
}
declare const DocsContainer: FC<PropsWithChildren<DocsContainerProps>>;

declare const PRIMARY_STORY = "^";
type Component = any;
type DocsStoryProps = {
    of: ModuleExport;
    expanded?: boolean;
    withToolbar?: boolean;
    __forceInitialArgs?: boolean;
    __primary?: boolean;
};

declare const DocsStory: FC<DocsStoryProps>;

type ExternalDocsProps<TRenderer extends Renderer$1 = Renderer$1> = {
    projectAnnotationsList: ProjectAnnotations<TRenderer>[];
};
declare function ExternalDocs<TRenderer extends Renderer$1 = Renderer$1>({ projectAnnotationsList, children, }: PropsWithChildren<ExternalDocsProps<TRenderer>>): React__default.JSX.Element;

declare const ExternalDocsContainer: React__default.FC<React__default.PropsWithChildren<{
    projectAnnotations: any;
}>>;

interface HeadingProps {
    disableAnchor?: boolean;
}
declare const Heading: FC<PropsWithChildren<HeadingProps>>;

/**
 * markdown-to-jsx is a fork of
 * [simple-markdown v0.2.2](https://github.com/Khan/simple-markdown)
 * from Khan Academy. Thank you Khan devs for making such an awesome
 * and extensible parsing infra... without it, half of the
 * optimizations here wouldn't be feasible. 🙏🏼
 */

/**
 * Analogous to `node.type`. Please note that the values here may change at any time,
 * so do not hard code against the value directly.
 */
declare const enum RuleType {
    blockQuote = "0",
    breakLine = "1",
    breakThematic = "2",
    codeBlock = "3",
    codeFenced = "4",
    codeInline = "5",
    footnote = "6",
    footnoteReference = "7",
    gfmTask = "8",
    heading = "9",
    headingSetext = "10",
    /** only available if not `disableHTMLParsing` */
    htmlBlock = "11",
    htmlComment = "12",
    /** only available if not `disableHTMLParsing` */
    htmlSelfClosing = "13",
    image = "14",
    link = "15",
    /** emits a `link` 'node', does not render directly */
    linkAngleBraceStyleDetector = "16",
    /** emits a `link` 'node', does not render directly */
    linkBareUrlDetector = "17",
    /** emits a `link` 'node', does not render directly */
    linkMailtoDetector = "18",
    newlineCoalescer = "19",
    orderedList = "20",
    paragraph = "21",
    ref = "22",
    refImage = "23",
    refLink = "24",
    table = "25",
    tableSeparator = "26",
    text = "27",
    textBolded = "28",
    textEmphasized = "29",
    textEscaped = "30",
    textMarked = "31",
    textStrikethroughed = "32",
    unorderedList = "33"
}
declare const enum Priority {
    /**
     * anything that must scan the tree before everything else
     */
    MAX = 0,
    /**
     * scans for block-level constructs
     */
    HIGH = 1,
    /**
     * inline w/ more priority than other inline
     */
    MED = 2,
    /**
     * inline elements
     */
    LOW = 3,
    /**
     * bare text and stuff that is considered leftovers
     */
    MIN = 4
}
/**
 * A simple HOC for easy React use. Feed the markdown content as a direct child
 * and the rest is taken care of automatically.
 */
declare const Markdown$1: React.FC<{
    [key: string]: any;
    children: string;
    options?: MarkdownToJSX.Options;
}>;
declare namespace MarkdownToJSX {
    /**
     * RequireAtLeastOne<{ ... }> <- only requires at least one key
     */
    type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> & {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
    }[Keys];
    export type CreateElement = typeof React.createElement;
    export type HTMLTags = keyof JSX.IntrinsicElements;
    export type State = {
        /** true if the current content is inside anchor link grammar */
        inAnchor?: boolean;
        /** true if parsing in an inline context (subset of rules around formatting and links) */
        inline?: boolean;
        /** true if in a table */
        inTable?: boolean;
        /** use this for the `key` prop */
        key?: React.Key;
        /** true if in a list */
        list?: boolean;
        /** true if parsing in inline context w/o links */
        simple?: boolean;
    };
    export interface BlockQuoteNode {
        children: MarkdownToJSX.ParserResult[];
        type: RuleType.blockQuote;
    }
    export interface BreakLineNode {
        type: RuleType.breakLine;
    }
    export interface BreakThematicNode {
        type: RuleType.breakThematic;
    }
    export interface CodeBlockNode {
        type: RuleType.codeBlock;
        attrs?: JSX.IntrinsicAttributes;
        lang?: string;
        text: string;
    }
    export interface CodeFencedNode {
        type: RuleType.codeFenced;
    }
    export interface CodeInlineNode {
        type: RuleType.codeInline;
        text: string;
    }
    export interface FootnoteNode {
        type: RuleType.footnote;
    }
    export interface FootnoteReferenceNode {
        type: RuleType.footnoteReference;
        target: string;
        text: string;
    }
    export interface GFMTaskNode {
        type: RuleType.gfmTask;
        completed: boolean;
    }
    export interface HeadingNode {
        type: RuleType.heading;
        children: MarkdownToJSX.ParserResult[];
        id: string;
        level: 1 | 2 | 3 | 4 | 5 | 6;
    }
    export interface HeadingSetextNode {
        type: RuleType.headingSetext;
    }
    export interface HTMLCommentNode {
        type: RuleType.htmlComment;
    }
    export interface ImageNode {
        type: RuleType.image;
        alt?: string;
        target: string;
        title?: string;
    }
    export interface LinkNode {
        type: RuleType.link;
        children: MarkdownToJSX.ParserResult[];
        target: string;
        title?: string;
    }
    export interface LinkAngleBraceNode {
        type: RuleType.linkAngleBraceStyleDetector;
    }
    export interface LinkBareURLNode {
        type: RuleType.linkBareUrlDetector;
    }
    export interface LinkMailtoNode {
        type: RuleType.linkMailtoDetector;
    }
    export interface OrderedListNode {
        type: RuleType.orderedList;
        items: MarkdownToJSX.ParserResult[][];
        ordered: true;
        start?: number;
    }
    export interface UnorderedListNode {
        type: RuleType.unorderedList;
        items: MarkdownToJSX.ParserResult[][];
        ordered: false;
    }
    export interface NewlineNode {
        type: RuleType.newlineCoalescer;
    }
    export interface ParagraphNode {
        type: RuleType.paragraph;
        children: MarkdownToJSX.ParserResult[];
    }
    export interface ReferenceNode {
        type: RuleType.ref;
    }
    export interface ReferenceImageNode {
        type: RuleType.refImage;
        alt?: string;
        ref: string;
    }
    export interface ReferenceLinkNode {
        type: RuleType.refLink;
        children: MarkdownToJSX.ParserResult[];
        fallbackChildren: MarkdownToJSX.ParserResult[];
        ref: string;
    }
    export interface TableNode {
        type: RuleType.table;
        /**
         * alignment for each table column
         */
        align: ('left' | 'right' | 'center')[];
        cells: MarkdownToJSX.ParserResult[][][];
        header: MarkdownToJSX.ParserResult[][];
    }
    export interface TableSeparatorNode {
        type: RuleType.tableSeparator;
    }
    export interface TextNode {
        type: RuleType.text;
        text: string;
    }
    export interface BoldTextNode {
        type: RuleType.textBolded;
        children: MarkdownToJSX.ParserResult[];
    }
    export interface ItalicTextNode {
        type: RuleType.textEmphasized;
        children: MarkdownToJSX.ParserResult[];
    }
    export interface EscapedTextNode {
        type: RuleType.textEscaped;
    }
    export interface MarkedTextNode {
        type: RuleType.textMarked;
        children: MarkdownToJSX.ParserResult[];
    }
    export interface StrikethroughTextNode {
        type: RuleType.textStrikethroughed;
        children: MarkdownToJSX.ParserResult[];
    }
    export interface HTMLNode {
        type: RuleType.htmlBlock;
        attrs: JSX.IntrinsicAttributes;
        children?: ReturnType<MarkdownToJSX.NestedParser> | undefined;
        noInnerParse: Boolean;
        tag: MarkdownToJSX.HTMLTags;
        text?: string | undefined;
    }
    export interface HTMLSelfClosingNode {
        type: RuleType.htmlSelfClosing;
        attrs: JSX.IntrinsicAttributes;
        tag: string;
    }
    export type ParserResult = BlockQuoteNode | BreakLineNode | BreakThematicNode | CodeBlockNode | CodeFencedNode | CodeInlineNode | FootnoteNode | FootnoteReferenceNode | GFMTaskNode | HeadingNode | HeadingSetextNode | HTMLCommentNode | ImageNode | LinkNode | LinkAngleBraceNode | LinkBareURLNode | LinkMailtoNode | OrderedListNode | UnorderedListNode | NewlineNode | ParagraphNode | ReferenceNode | ReferenceImageNode | ReferenceLinkNode | TableNode | TableSeparatorNode | TextNode | BoldTextNode | ItalicTextNode | EscapedTextNode | MarkedTextNode | StrikethroughTextNode | HTMLNode | HTMLSelfClosingNode;
    export type NestedParser = (input: string, state?: MarkdownToJSX.State) => MarkdownToJSX.ParserResult[];
    export type Parser<ParserOutput> = (capture: RegExpMatchArray, nestedParse: NestedParser, state?: MarkdownToJSX.State) => ParserOutput;
    export type RuleOutput = (ast: MarkdownToJSX.ParserResult | MarkdownToJSX.ParserResult[], state: MarkdownToJSX.State) => JSX.Element;
    export type Rule<ParserOutput = MarkdownToJSX.ParserResult> = {
        match: (source: string, state: MarkdownToJSX.State, prevCapturedString?: string) => RegExpMatchArray;
        order: Priority;
        parse: MarkdownToJSX.Parser<Omit<ParserOutput, 'type'>>;
        render?: (node: ParserOutput, 
        /**
         * Continue rendering AST nodes if applicable.
         */
        render: RuleOutput, state?: MarkdownToJSX.State) => React.ReactChild;
    };
    export type Rules = {
        [K in ParserResult['type']]: Rule<Extract<ParserResult, {
            type: K;
        }>>;
    };
    export type Override = RequireAtLeastOne<{
        component: React.ElementType;
        props: Object;
    }> | React.ElementType;
    export type Overrides = {
        [tag in HTMLTags]?: Override;
    } & {
        [customComponent: string]: Override;
    };
    export type Options = Partial<{
        /**
         * Ultimate control over the output of all rendered JSX.
         */
        createElement: (tag: Parameters<CreateElement>[0], props: JSX.IntrinsicAttributes, ...children: React.ReactChild[]) => React.ReactChild;
        /**
         * Disable the compiler's best-effort transcription of provided raw HTML
         * into JSX-equivalent. This is the functionality that prevents the need to
         * use `dangerouslySetInnerHTML` in React.
         */
        disableParsingRawHTML: boolean;
        /**
         * Forces the compiler to have space between hash sign and the header text which
         * is explicitly stated in the most of the markdown specs.
         * https://github.github.com/gfm/#atx-heading
         * `The opening sequence of # characters must be followed by a space or by the end of line.`
         */
        enforceAtxHeadings: boolean;
        /**
         * Forces the compiler to always output content with a block-level wrapper
         * (`<p>` or any block-level syntax your markdown already contains.)
         */
        forceBlock: boolean;
        /**
         * Forces the compiler to always output content with an inline wrapper (`<span>`)
         */
        forceInline: boolean;
        /**
         * Forces the compiler to wrap results, even if there is only a single
         * child or no children.
         */
        forceWrapper: boolean;
        /**
         * Supply additional HTML entity: unicode replacement mappings.
         *
         * Pass only the inner part of the entity as the key,
         * e.g. `&le;` -> `{ "le": "\u2264" }`
         *
         * By default
         * the following entities are replaced with their unicode equivalents:
         *
         * ```
         * &amp;
         * &apos;
         * &gt;
         * &lt;
         * &nbsp;
         * &quot;
         * ```
         */
        namedCodesToUnicode: {
            [key: string]: string;
        };
        /**
         * Selectively control the output of particular HTML tags as they would be
         * emitted by the compiler.
         */
        overrides: Overrides;
        /**
         * Allows for full control over rendering of particular rules.
         * For example, to implement a LaTeX renderer such as `react-katex`:
         *
         * ```
         * renderRule(next, node, renderChildren, state) {
         *   if (node.type === RuleType.codeBlock && node.lang === 'latex') {
         *     return (
         *       <TeX as="div" key={state.key}>
         *         {String.raw`${node.text}`}
         *       </TeX>
         *     )
         *   }
         *
         *   return next();
         * }
         * ```
         *
         * Thar be dragons obviously, but you can do a lot with this
         * (have fun!) To see how things work internally, check the `render`
         * method in source for a particular rule.
         */
        renderRule: (
        /** Resume normal processing, call this function as a fallback if you are not returning custom JSX. */
        next: () => React.ReactChild, 
        /** the current AST node, use `RuleType` against `node.type` for identification */
        node: ParserResult, 
        /** use as `renderChildren(node.children)` for block nodes */
        renderChildren: RuleOutput, 
        /** contains `key` which should be supplied to the topmost JSX element */
        state: State) => React.ReactChild;
        /**
         * Override normalization of non-URI-safe characters for use in generating
         * HTML IDs for anchor linking purposes.
         */
        slugify: (source: string) => string;
        /**
         * Declare the type of the wrapper to be used when there are multiple
         * children to render. Set to `null` to get an array of children back
         * without any wrapper, or use `React.Fragment` to get a React element
         * that won't show up in the DOM.
         */
        wrapper: React.ElementType | null;
    }>;
    export {};
}

type MarkdownProps = typeof Markdown$1 extends React__default.ComponentType<infer Props> ? Props : never;
declare const Markdown: (props: MarkdownProps) => React__default.JSX.Element;

type MetaProps = BaseAnnotations & {
    of?: ModuleExports;
    title?: string;
};
/**
 * This component is used to declare component metadata in docs and gets transformed into a default
 * export underneath the hood.
 */
declare const Meta: FC<MetaProps>;

interface PrimaryProps {
    /** Specify where to get the primary story from. */
    of?: Of;
}
declare const Primary: FC<PrimaryProps>;

interface StoriesProps {
    title?: ReactElement | string;
    includePrimary?: boolean;
}
declare const Stories: FC<StoriesProps>;

declare const Subheading: FC<PropsWithChildren<HeadingProps>>;

interface SubtitleProps {
    children?: ReactNode;
    /**
     * Specify where to get the subtitle from. If not specified, the subtitle will be extracted from
     * the meta of the attached CSF file.
     */
    of?: Of;
}
declare const Subtitle: FunctionComponent<SubtitleProps>;

interface TitleProps {
    /**
     * Specify where to get the title from. Must be a CSF file's default export. If not specified, the
     * title will be read from children, or extracted from the meta of the attached CSF file.
     */
    of?: Of;
    /** Specify content to display as the title. */
    children?: ReactNode;
}
declare const extractTitle: (title: ComponentTitle) => string;
declare const Title: FunctionComponent<TitleProps>;

declare const Unstyled: React__default.FC<React__default.DetailedHTMLProps<React__default.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;

declare const Wrapper: FC<React__default.DetailedHTMLProps<React__default.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;

declare const assertIsFn: (val: any) => any;
declare const AddContext: FC<PropsWithChildren<DocsContextProps>>;
interface CodeOrSourceMdxProps {
    className?: string;
}
declare const CodeOrSourceMdx: FC<PropsWithChildren<CodeOrSourceMdxProps>>;
interface AnchorMdxProps {
    href: string;
    target: string;
}
declare const AnchorMdx: FC<PropsWithChildren<AnchorMdxProps>>;
interface HeaderMdxProps {
    as: string;
    id: string;
}
declare const HeaderMdx: FC<PropsWithChildren<HeaderMdxProps>>;
declare const HeadersMdx: {};

interface ControlProps<T> {
    name: string;
    value?: T;
    defaultValue?: T;
    argType?: ArgType;
    onChange: (value?: T) => T | void;
    onFocus?: (evt: any) => void;
    onBlur?: (evt: any) => void;
}
type BooleanValue = boolean;
interface BooleanConfig {
}
type ColorValue = string;
type PresetColor = ColorValue | {
    color: ColorValue;
    title?: string;
};
interface ColorConfig {
    presetColors?: PresetColor[];
    /**
     * Whether the color picker should be open by default when rendered.
     *
     * @default false
     */
    startOpen?: boolean;
}
type DateValue = Date | number;
interface DateConfig {
}
type NumberValue = number;
interface NumberConfig {
    min?: number;
    max?: number;
    step?: number;
}
type RangeConfig = NumberConfig;
type ObjectValue = any;
interface ObjectConfig {
}
type OptionsSingleSelection = any;
type OptionsMultiSelection = any[];
type OptionsSelection = OptionsSingleSelection | OptionsMultiSelection;
type OptionsArray = any[];
type OptionsObject = Record<string, any>;
type Options = OptionsArray | OptionsObject;
type OptionsControlType = 'radio' | 'inline-radio' | 'check' | 'inline-check' | 'select' | 'multi-select';
interface OptionsConfig {
    labels?: Record<any, string>;
    type: OptionsControlType;
}
interface NormalizedOptionsConfig {
    options: OptionsObject;
}
type TextValue = string;
interface TextConfig {
    maxLength?: number;
}
type ControlType = 'array' | 'boolean' | 'color' | 'date' | 'number' | 'range' | 'object' | OptionsControlType | 'text';
type Control = BooleanConfig | ColorConfig | DateConfig | NumberConfig | ObjectConfig | OptionsConfig | RangeConfig | TextConfig;

type ColorControlProps = ControlProps<ColorValue> & ColorConfig;

type BooleanProps = ControlProps<BooleanValue> & BooleanConfig;
/**
 * # Boolean Control
 *
 * Renders a switch toggle with "True" or "False". or if the value is `undefined`, renders a button
 * to set the boolean.
 *
 * ## Example usage
 *
 * ```
 * <BooleanControl name="isTrue" value={value} onChange={handleValueChange} />;
 * ```
 */
declare const BooleanControl: FC<BooleanProps>;

declare const parseDate: (value: string) => Date;
declare const parseTime: (value: string) => Date;
declare const formatDate: (value: Date | number) => string;
declare const formatTime: (value: Date | number) => string;
type DateProps = ControlProps<DateValue> & DateConfig;
declare const DateControl: FC<DateProps>;

type NumberProps = ControlProps<NumberValue | null> & NumberConfig;
declare const parse: (value: string) => number;
declare const format: (value: NumberValue) => string;
declare const NumberControl: FC<NumberProps>;

type OptionsProps = ControlProps<OptionsSelection> & OptionsConfig;
declare const OptionsControl: FC<OptionsProps>;

type ObjectProps = ControlProps<ObjectValue> & ObjectConfig;
declare const ObjectControl: FC<ObjectProps>;

type RangeProps = ControlProps<NumberValue | null> & RangeConfig;
declare const RangeControl: FC<RangeProps>;

type TextProps = ControlProps<TextValue | undefined> & TextConfig;
declare const TextControl: FC<TextProps>;

interface FilesControlProps extends ControlProps<string[]> {
    /**
     * The accept attribute value is a string that defines the file types the file input should
     * accept. This string is a comma-separated list of unique file type specifiers.
     *
     * @example _/_
     *
     * @example .webm,video/webm
     *
     * @example .doc,.docx,application/msword
     *
     * @defaultValue `image/*`
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
     */
    accept?: string;
}
declare const FilesControl: FC<FilesControlProps>;

type ColorProps = ColorControlProps;
declare const LazyColorControl: React__default.LazyExoticComponent<React__default.FC<ColorControlProps>>;
declare const ColorControl: (props: ComponentProps<typeof LazyColorControl>) => React__default.JSX.Element;

export { AddContext, Anchor, AnchorMdx, AnchorProps, ArgTypes, BooleanConfig, BooleanControl, BooleanProps, BooleanValue, Canvas, CodeOrSourceMdx, ColorConfig, ColorControl, ColorItem, ColorPalette, ColorProps, ColorValue, Component, Control, ControlProps, ControlType, Controls, DateConfig, DateControl, DateProps, DateValue, DescriptionContainer as Description, DescriptionType, Docs, DocsContainer, DocsContainerProps, DocsContext, DocsPage, DocsProps, DocsStory, DocsStoryProps, ExternalDocs, ExternalDocsContainer, ExternalDocsProps, FilesControl, FilesControlProps, HeaderMdx, HeadersMdx, Heading, HeadingProps, IconGallery, IconItem, Markdown, Meta, NormalizedOptionsConfig, NumberConfig, NumberControl, NumberValue, ObjectConfig, ObjectControl, ObjectProps, ObjectValue, Of, Options, OptionsArray, OptionsConfig, OptionsControl, OptionsControlType, OptionsMultiSelection, OptionsObject, OptionsProps, OptionsSelection, OptionsSingleSelection, PRIMARY_STORY, PresetColor, Primary, ArgsTable as PureArgsTable, RangeConfig, RangeControl, SortType, Source, SourceContainer, SourceContext, SourceContextProps, SourceItem, SourceProps, Stories, Story, StoryProps, StorySources, Subheading, Subtitle, TextConfig, TextControl, TextProps, TextValue, Title, Typeset, UNKNOWN_ARGS_HASH, Unstyled, Wrapper, anchorBlockIdFromId, argsHash, assertIsFn, extractTitle, format, formatDate, formatTime, getStoryId, getStoryProps, parse, parseDate, parseTime, useOf, useSourceProps };
