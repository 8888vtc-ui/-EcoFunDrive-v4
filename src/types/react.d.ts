// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - TYPES REACT
// Déclarations de types pour React et JSX
// ═══════════════════════════════════════════════════════════

declare module 'react' {
  export interface ReactElement {
    type: any;
    props: any;
    key: any;
  }

  export interface ComponentType<P = {}> {
    (props: P): ReactElement | null;
  }

  export interface FC<P = {}> {
    (props: P): ReactElement | null;
  }

  export function useState<T>(initial: T): [T, (value: T) => void];
  export function useEffect(effect: () => void, deps?: any[]): void;
  export function useCallback<T extends Function>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initial: T): { current: T };
  export function createContext<T>(defaultValue: T): any;
  export function useContext<T>(context: any): T;
  export function useReducer<T, A>(reducer: (state: T, action: A) => T, initialState: T): [T, (action: A) => void];
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export const Fragment: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h4: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h5: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h6: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
      button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
      img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
      ul: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
      ol: React.DetailedHTMLProps<React.HTMLAttributes<HTMLOListElement>, HTMLOListElement>;
      li: React.DetailedHTMLProps<React.HTMLAttributes<HTMLLIElement>, HTMLLIElement>;
      table: React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
      thead: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      tbody: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      tr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
      th: React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
      td: React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
      nav: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      article: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      header: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      footer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      main: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      aside: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
      label: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
      select: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
      option: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
      textarea: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
      hr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
      br: React.DetailedHTMLProps<React.HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
      strong: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      em: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      code: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      pre: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
      blockquote: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      dl: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
      dt: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDTElement>, HTMLDTElement>;
      dd: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDDElement>, HTMLDDElement>;
      small: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      sub: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      sup: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      i: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      b: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      svg: React.SVGProps<SVGSVGElement>;
      path: React.SVGProps<SVGPathElement>;
      address: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

declare module 'lucide-react' {
  export function Cookie(props: any): React.ReactElement;
  export function Shield(props: any): React.ReactElement;
  export function X(props: any): React.ReactElement;
  export function Check(props: any): React.ReactElement;
  export function Info(props: any): React.ReactElement;
  export function Eye(props: any): React.ReactElement;
  export function Edit3(props: any): React.ReactElement;
  export function Trash2(props: any): React.ReactElement;
  export function Download(props: any): React.ReactElement;
  export function Lock(props: any): React.ReactElement;
  export function Mail(props: any): React.ReactElement;
  export function Phone(props: any): React.ReactElement;
  export function MapPin(props: any): React.ReactElement;
  export function Calendar(props: any): React.ReactElement;
}

declare module React {
  interface DetailedHTMLProps<T, E> {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent<E>) => void;
    onChange?: (event: React.ChangeEvent<E>) => void;
    onSubmit?: (event: React.FormEvent<E>) => void;
    [key: string]: any;
  }

  interface HTMLAttributes<T> {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    [key: string]: any;
  }

  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: string;
    value?: string;
    checked?: boolean;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
  }

  interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
  }

  interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
    href?: string;
    target?: string;
    rel?: string;
  }

  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
  }

  interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
    onSubmit?: (event: React.FormEvent<T>) => void;
  }

  interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
    htmlFor?: string;
  }

  interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
    value?: string;
    multiple?: boolean;
  }

  interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
    value?: string;
    selected?: boolean;
  }

  interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
    value?: string;
    placeholder?: string;
    rows?: number;
    cols?: number;
  }

  interface CSSProperties {
    [key: string]: string | number;
  }

  interface SVGProps<T> {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    width?: string | number;
    height?: string | number;
    viewBox?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: string | number;
    d?: string;
    [key: string]: any;
  }

  interface MouseEvent<T> {
    preventDefault(): void;
    stopPropagation(): void;
    currentTarget: T;
    target: T;
  }

  interface ChangeEvent<T> {
    target: T;
  }

  interface FormEvent<T> {
    preventDefault(): void;
    currentTarget: T;
  }

  interface ReactElement {
    type: any;
    props: any;
    key: any;
  }

  type ReactNode = ReactElement | string | number | boolean | null | undefined | any[];
}

export {};
