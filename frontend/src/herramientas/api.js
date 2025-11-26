export async function fetchProteinaData(filters = {}) {
  const BASE_URL = "http://localhost:8000/api/v1/products";

  // Construir query params dinámicamente
  const params = new URLSearchParams();

  if (filters.min_price !== undefined && filters.min_price !== null) {
    params.append("min_price", filters.min_price);
  }

  if (filters.max_price !== undefined && filters.max_price !== null) {
    params.append("max_price", filters.max_price);
  }

  if (filters.category && filters.category !== "") {
    params.append("category", filters.category);
  }

  if (filters.product_type && filters.product_type !== "") {
    params.append("product_type", filters.product_type);
  }

  if (filters.search && filters.search !== "") {
    params.append("search", filters.search);
  }

  const queryString = params.toString();
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function fetchCreatinaData(filters = {}) {
  const BASE_URL = "http://localhost:8000/api/v1/creatinas";

  // Construir query params dinámicamente
  const params = new URLSearchParams();

  if (filters.min_price !== undefined && filters.min_price !== null) {
    params.append("min_price", filters.min_price);
  }

  if (filters.max_price !== undefined && filters.max_price !== null) {
    params.append("max_price", filters.max_price);
  }

  if (filters.category && filters.category !== "") {
    params.append("category", filters.category);
  }

  if (filters.search && filters.search !== "") {
    params.append("search", filters.search);
  }

  const queryString = params.toString();
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function fetchPreentrenoData(filters = {}) {
  const BASE_URL = "http://localhost:8000/api/v1/preentrenos";

  // Construir query params dinámicamente
  const params = new URLSearchParams();

  if (
    filters.minPrice !== undefined &&
    filters.minPrice !== null &&
    filters.minPrice !== ""
  ) {
    params.append("min_price", filters.minPrice);
  }

  if (
    filters.maxPrice !== undefined &&
    filters.maxPrice !== null &&
    filters.maxPrice !== ""
  ) {
    params.append("max_price", filters.maxPrice);
  }

  if (filters.category && filters.category !== "") {
    params.append("category", filters.category);
  }

  if (filters.search && filters.search !== "") {
    params.append("search", filters.search);
  }

  const queryString = params.toString();
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

  const response = await fetch(url);
  const data = await response.json();
  return data;
}
