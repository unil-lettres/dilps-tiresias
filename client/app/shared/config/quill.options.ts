import { QuillConfig } from 'ngx-quill';
import { pick } from 'lodash';

export function keepOnlyTextAndBasicFormatting(node, delta) {
    const ops = [];
    delta.ops.forEach(op => {
        if (op.insert && typeof op.insert === 'string') {
            ops.push({
                insert: op.insert,
                attributes: pick(op.attributes, ['bold', 'italic', 'underline']),
            });
        }
    });

    delta.ops = ops;
    return delta;
}

export const quillConfig: QuillConfig = {
    theme: 'bubble',
    placeholder: '',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline'], // toggled buttons
            ['clean'], // remove formatting button
        ],
        clipboard: {
            matchers: [
                [
                    Node.ELEMENT_NODE,
                    keepOnlyTextAndBasicFormatting,
                ],
            ],
        },
    },
};
