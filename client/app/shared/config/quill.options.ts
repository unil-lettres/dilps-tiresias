import { QuillConfig } from 'ngx-quill';
import { filter, pick } from 'lodash';

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
                    (node, delta) => {
                        const ops = [];
                        delta.ops.forEach(op => {
                            // Keep only text and basic formatting
                            if (op.insert && typeof op.insert === 'string') {
                                ops.push({
                                    insert: op.insert,
                                    attributes: pick(op.attributes, ['bold', 'italic', 'underline']),
                                });
                            }
                        });

                        delta.ops = ops;
                        return delta;
                    },
                ],
            ],
        },
    },
};
