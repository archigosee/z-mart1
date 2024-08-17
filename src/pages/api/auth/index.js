export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { name, userId } = req.body;
  
      console.log(`POST Request - Name: ${name}, UserID: ${userId}`);
  
      res.status(200).json({ success: true, message: 'Data received' });
    } else if (req.method === 'GET') {
      // Example: Return a static message or some default data
      res.status(200).json({ success: true, message: 'GET request received' });
    } else {
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  