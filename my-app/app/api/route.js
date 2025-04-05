export async function GET(request) {
    // For example, fetch data from your DB here
    const prompt = [
      { id: 1, name: 'Alice' },
    ];
    return new Response(JSON.stringify(prompt), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
   
  export async function POST(request) {
    // Parse the request body
    const body = await request.json();
    const { name } = body;
   
    // e.g. Insert new user into your DB
    const newUser = { id: Date.now(), name };
   
    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  }