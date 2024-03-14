import {QuillConfig} from 'ngx-quill';
import {pick} from 'lodash-es';
import {ClipboardMatcherCallback} from 'quill';

type Delta = ReturnType<ClipboardMatcherCallback>;

export function keepOnlyTextAndBasicFormatting(node: Node, delta: Delta): Delta {
    const ops: any[] = [];
    delta.ops?.forEach((op: any) => {
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
            matchers: [[Node.ELEMENT_NODE, keepOnlyTextAndBasicFormatting]],
        },
    },
};
