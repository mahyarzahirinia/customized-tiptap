import { Mark, mergeAttributes } from "@tiptap/core";

export interface LinkAnchorOptions {
  openOnClick: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    linkAnchor: {
      /**
       * Set a link.
       */
      setLinkAnchor: (options: { href: string }) => ReturnType;
      /**
       * Unset a link.
       */
      unsetLinkAnchor: () => ReturnType;
    };
  }
}

export const LinkAnchor = Mark.create<LinkAnchorOptions>({
  name: "linkAnchor",

  addOptions() {
    return {
      openOnClick: true,
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      href: {
        default: null,
        parseHTML: (element) => element.getAttribute("href"),
        renderHTML: (attributes) => {
          if (!attributes.href) {
            return {};
          }
          return {
            href: attributes.href,
            target: attributes.href.startsWith("#") ? null : "_blank",
            rel: attributes.href.startsWith("#") ? null : "noopener noreferrer",
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "a[href]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "a",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setLinkAnchor:
        ({ href }) =>
        ({ commands }) => {
          if (!/^(#|https?:\/\/)/.test(href)) {
            return false; // Invalid URL
          }
          return commands.setMark(this.name, { href });
        },
      unsetLinkAnchor:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-k": () => this.editor.commands.unsetMark(this.name),
    };
  },

  addClickHandler() {
    return ({
      event,
      getAttributes,
    }: {
      event: Event;
      getAttributes: () => Record<string, any>;
    }) => {
      const href = getAttributes().href;
      if (this.options.openOnClick && href) {
        if (href.startsWith("#")) {
          // Handle in-page anchor navigation
          const anchor = document.querySelector(href);
          if (anchor) {
            event.preventDefault();
            anchor.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          // Handle external links
          window.open(href, "_blank", "noopener,noreferrer");
        }
      }
    };
  },
});
