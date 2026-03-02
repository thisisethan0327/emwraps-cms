/**
 * Fix blog post content: replace "block" nodes with "upload" nodes
 * so Payload's Lexical editor can parse them correctly.
 */

const CMS_URL = 'http://localhost:3001';

async function main() {
    // Login
    const loginRes = await fetch(`${CMS_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@emwraps.net', password: '@Emem98134' }),
    });
    const { token } = await loginRes.json();
    console.log('✅ Logged in');

    // Get current post
    const postRes = await fetch(`${CMS_URL}/api/posts/1?draft=true`, {
        headers: { 'Authorization': `JWT ${token}` },
    });
    const post = await postRes.json();
    const content = post.content;

    // Count existing block nodes
    const contentStr = JSON.stringify(content);
    const blocksBefore = (contentStr.match(/"type":"block"/g) || []).length;
    console.log(`Found ${blocksBefore} "block" nodes to fix`);

    // Fix: replace 'block' nodes with 'upload' nodes
    function fixNodes(children) {
        return children.map(node => {
            if (node.type === 'block' && node.fields?.blockType === 'mediaBlock') {
                console.log(`  → Converting block (media ID: ${node.fields.media}) to upload node`);
                return {
                    type: 'upload',
                    relationTo: 'media',
                    value: node.fields.media,
                    format: '',
                    version: 2,
                };
            }
            if (node.children) {
                node.children = fixNodes(node.children);
            }
            return node;
        });
    }

    content.root.children = fixNodes(content.root.children);

    // Patch the post
    const patchRes = await fetch(`${CMS_URL}/api/posts/1?draft=true`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${token}`,
        },
        body: JSON.stringify({ content, _status: 'published' }),
    });
    const result = await patchRes.json();

    if (result.doc) {
        const resultStr = JSON.stringify(result.doc.content);
        const blocksAfter = (resultStr.match(/"type":"block"/g) || []).length;
        const uploadsAfter = (resultStr.match(/"type":"upload"/g) || []).length;
        console.log(`\n✅ Post patched!`);
        console.log(`   block nodes: ${blocksAfter} | upload nodes: ${uploadsAfter}`);
        console.log(`   _status: ${result.doc._status}`);
    } else {
        console.error('❌ Failed:', JSON.stringify(result, null, 2));
    }
}

main().catch(console.error);
