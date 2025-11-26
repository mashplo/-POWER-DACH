export async function fetchProteinaData() {
    const URL = 'http://localhost:8000/api/v1/products'
    const response = await fetch(URL)
    const data = await response.json()
    return data 
}