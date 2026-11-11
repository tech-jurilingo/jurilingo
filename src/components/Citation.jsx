import { Node, mergeAttributes } from '@tiptap/core';

const Citation = Node.create({
  name: 'citation',

  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
      number: {
        default: 1,
      },
      url: {
        default: '',
      },
      text: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-citation]',
        getAttrs: element => ({
          id: element.getAttribute('data-id'),
          number: Number(element.getAttribute('data-number')),
          url: element.getAttribute('data-url'),
          text: element.getAttribute('data-text'),
        }),
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { id, number, url } = node.attrs;

    return [
      'sup',
      mergeAttributes(HTMLAttributes, {
        'data-citation': '',
        'data-id': id,
        'data-number': number,
        'data-url': url,
      }),
      [
        'a',
        {
          href: `#footnote-${id}`,
          class: 'citation-link',
        },
        `[${number}]`,
      ],
    ];
  },
});

export default Citation;