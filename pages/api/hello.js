// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const data = await axios.get("https://api.gmx.io/prices")
    .then(function (response) {
      // Handle successful response
      console.log('Data:', response.data);
      return res.status(200).json({ success: true, data: response.data })
    })

    .catch(function (error) {
      // Handle error
      console.error('Error:', error);
      return res.status(400).json({ success: false, message: "Couldn't fetch data" })
    });
  return res.status(200).json({ name: 'John Doe' })
}
