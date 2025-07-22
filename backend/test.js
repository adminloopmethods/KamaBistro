// import fetch from 'node-fetch';

async function run() {
  const resp = await fetch(
    `https://toast-api-server/authentication/v1/authentication/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientId: 'VKuhk4NaLedOcjZpJM8grvdrsFi3MlcM',
        clientSecret: 'eS960aiKdvgbSDcLUCk68HR2CJKwwHNO2HKfgxjCWxoj27KIp6jFAi2XOOc_oCuv',
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
