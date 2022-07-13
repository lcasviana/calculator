(function () {
  const formElement = document.querySelector('#form form');
  const formInputElement = document.querySelector('#form-input');
  const formSubmitElement = document.querySelector('#form-submit');
  const tableBodyElement = document.querySelector('#table-body');
  let tableRowsCount = 0;

  formInputElement.value = toDatetimeString(new Date());
  formSubmitElement.addEventListener('click', computeInvestment);

  /**
   * Transform Date into string (yyyy-MM-ddTHH:mm).
   * @param {Date} datetime
   * @returns {string} 
   */
  function toDatetimeString(datetime) {
    const year = datetime.getFullYear().toString();
    const month = ('0' + (datetime.getMonth() + 1)).slice(-2);
    const day = ('0' + datetime.getDate()).slice(-2);
    const hours = ('0' + datetime.getHours()).slice(-2);
    const minutes = ('0' + datetime.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  /**
   * Transform Date into string (dd-MM-yyyy).
   * @param {Date} datetime
   * @returns {string} 
   */
  function toDateString(datetime) {
    const year = datetime.getFullYear().toString();
    const month = ('0' + (datetime.getMonth() + 1)).slice(-2);
    const day = ('0' + datetime.getDate()).slice(-2);
    return `${day}-${month}-${year}`;
  }

  /**
   * Transform Date into locale string (dd-MM-yyyy HH:mm).
   * @param {Date} datetime
   * @returns {string} 
   */
  function toLocaleString(datetime) {
    const year = datetime.getFullYear().toString();
    const month = ('0' + (datetime.getMonth() + 1)).slice(-2);
    const day = ('0' + datetime.getDate()).slice(-2);
    const hours = ('0' + datetime.getHours()).slice(-2);
    const minutes = ('0' + datetime.getMinutes()).slice(-2);
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  /**
   * Returns the next lotto draw based on user input.
   * @param {Date} input
   * @returns {Date} 
   */
  function getNextLottoDraw(input) {
    const datetime = new Date(input);
    const dayOfWeek = datetime.getDay();
    if (0 <= dayOfWeek && dayOfWeek < 3) {
      datetime.setDate(datetime.getDate() + 3 - dayOfWeek);
    } else if (4 <= dayOfWeek && dayOfWeek < 6) {
      datetime.setDate(datetime.getDate() + 6 - dayOfWeek);
    } else if (dayOfWeek === 3 && datetime.getHours() >= 20) {
      datetime.setDate(datetime.getDate() + 3);
    } else if (dayOfWeek === 6 && datetime.getHours() >= 20) {
      datetime.setDate(datetime.getDate() + 4);
    }
    datetime.setHours(20);
    datetime.setMinutes(0);
    return datetime;
  }

  /**
   * Fetch data from Gecko API.
   * @param {string} path
   * @returns {Promise<any>}
   */
  async function fetchGeckoApi(path) {
    const geckoApiBaseUrl = 'https://api.coingecko.com/api';
    const response = await fetch(`${geckoApiBaseUrl}/${path}`);
    return await response.json();
  }

  /**
   * Fetch Bitcoin value at date.
   * @param {Date} datetime
   * @returns {Promise<number | undefined>}
   */
  async function fetchBitcoinValueAtDate(datetime) {
    const dateString = toDateString(datetime);
    const jsonResponse = await fetchGeckoApi(`v3/coins/bitcoin/history?date=${dateString}`);
    /** @type {number} */
    const bitcoinEuroValueAtDate = jsonResponse?.market_data?.current_price?.eur;
    return bitcoinEuroValueAtDate;
  }

  /**
   * Fetch current Bitcoin value.
   * @returns {Promise<number | undefined>}
   */
  async function fetchBitcoinValueCurrent() {
    const jsonResponse = await fetchGeckoApi('v3/coins/bitcoin');
    /** @type {number} */
    const bitcoinEuroValueCurrent = jsonResponse?.market_data?.current_price?.eur;
    return bitcoinEuroValueCurrent;
  }

  /**
   * Calculate winnings based on previous and current values.
   * @param {number} previous Bitcoin previous value.
   * @param {number} current Bitcoin current value.
   * @returns {number} Winnings based on €100.
   */
  function calculateWinnings(previous, current) {
    if (previous === undefined || current === undefined) return 0;
    return (current / previous) * 100;
  }

  /**
   * Insert cell into row.
   * @param {Element} row
   * @param {string} value
   * @returns
   */
  function insertCellIntoRow(row, value) {
    const cell = row.insertCell(), paragraph = document.createElement('p');
    paragraph.appendChild(document.createTextNode(value));
    cell.appendChild(paragraph);
  }

  /**
   * Insert row into table.
   * @param {Element} table
   * @param {Date} lottoDraw Lotto draw date.
   * @param {number} winnings Winnings in Euro (€).
   * @returns
   */
  function insertRowIntoTable(table, lottoDraw, winnings) {
    const date = toLocaleString(lottoDraw), value = `€${winnings.toFixed(2)}`;
    /** @type {Element} */
    const row = table.insertRow();
    row.classList.add(winnings >= 100 ? 'success' : 'failure');
    insertCellIntoRow(row, date);
    insertCellIntoRow(row, value);
  }

  /**
   * Compute investment.
   * @returns
   */
  async function computeInvestment() {
    const formInputValue = new Date(formInputElement.value);
    if (isNaN(formInputValue.getTime())) {
      formElement.reportValidity();
      return;
    };
    const nextLottoDrawDate = getNextLottoDraw(formInputValue);
    const bitcoinEuroValueAtDate = await fetchBitcoinValueAtDate(nextLottoDrawDate);
    const bitcoinEuroValueCurrent = await fetchBitcoinValueCurrent();
    const winnings = calculateWinnings(bitcoinEuroValueAtDate, bitcoinEuroValueCurrent);
    if (tableRowsCount === 0) tableBodyElement.innerHTML = '';
    insertRowIntoTable(tableBodyElement, nextLottoDrawDate, winnings);
    tableRowsCount++;
  }
})();