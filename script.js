const input = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderSection = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {
    if (!countryName) return;

    spinner.classList.remove('hidden');
    countryInfo.classList.add('hidden');
    borderSection.classList.add('hidden');
    errorMessage.classList.add('hidden');
    errorMessage.textContent = "";

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        
        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();
        const country = data[0];

        // Display main country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;

        countryInfo.classList.remove('hidden');

        // Handle bordering countries
        if (country.borders && country.borders.length > 0) {
            borderSection.innerHTML = "<h3>Bordering Countries</h3>";

            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                borderSection.innerHTML += `
                    <div class="country-card">
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag">
                    </div>
                `;
            }

            borderSection.classList.remove('hidden');
        } else {
            borderSection.innerHTML = "<p>No bordering countries.</p>";
            borderSection.classList.remove('hidden');
        }

    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally {
        spinner.classList.add('hidden');
    }
}

// Button click
searchBtn.addEventListener('click', () => {
    searchCountry(input.value.trim());
});

// Press Enter
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCountry(input.value.trim());
    }
});