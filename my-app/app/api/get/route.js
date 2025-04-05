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