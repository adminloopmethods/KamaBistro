// import fetch from 'node-fetch';

async function run() {
  const resp = await fetch(
    `https://ws-api.toasttab.com/authentication/v1/authentication/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientId: 'ol5K1dXoXdkMvwq0V2X6UJKw8Wj3DtJ',
        clientSecret: 'aVtButyY_UBJqeMX-jbFnSBARzFRJLZub9D7xq0m51CuD2TGJ8i9F8bJ2pU4hx-U',
        userAccessType: 'TOAST_MACHINE_CLIENT'
      })
    }
  );

  console.log(resp)
  const data = await resp.json();
  console.log(data);
}

run();
// import fetch from 'node-fetch';

// async function run() {
//     try {
//         const resp = await fetch('https://jsonplaceholder.typicode.com/posts/1');
//         console.log('Status:', resp.status);
//         const data = await resp.json();
//         console.log('Response:', data);
//     } catch (err) {
//         console.error('Fetch error:', err);
//     }
// }

// run();
