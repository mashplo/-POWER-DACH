export async function fetchProteinaData(minPrice) {
    const BASE_URL = 'http://localhost:8000/api/v1/products'
    const url = (minPrice !== undefined && minPrice !== null) ? `${BASE_URL}?min_price=${minPrice}` : BASE_URL
    const response = await fetch(url)
    const data = await response.json()
    return data
}