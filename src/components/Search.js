import {
  searchInputEl,
  searchFormEl,
  jobListSearchEl,
  numberEl,
  BASE_URL,
  sortingBtnRecentEl,
  sortingBtnRelevantEl,
  state,
} from "../common.js";
import renderError from "./Error.js";
import renderSpinner from "./Spinner.js";
import renderJobList from "./JobList.js";
import renderPaginationButtons from "./Pagination.js";

const submitHandler = (event) => {
  event.preventDefault();
  const searchText = searchInputEl.value;
  const forbiddenPattern = /[0-9]/;
  const patternMatch = forbiddenPattern.test(searchText);
  if (patternMatch) {
    renderError("Your search may not contain numbers");
    return;
  }

  searchInputEl.blur();

  jobListSearchEl.innerHTML = "";
  sortingBtnRecentEl.classList.remove("sorting__button--active");
  sortingBtnRelevantEl.classList.add("sorting__button--active");
  renderSpinner("search");

  fetch(`${BASE_URL}?search=${searchText}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Resource issue (e.g. resource doesn't exist) or server issue"
        );
      }

      return response.json();
    })
    .then((data) => {
      const { jobItems } = data;
      state.searchJobItems = jobItems;
      renderSpinner("search");
      numberEl.textContent = jobItems.length;
      renderPaginationButtons();
      renderJobList();
    })
    .catch((error) => {
      renderSpinner("search");
      renderError(error.message);
    });
};

searchFormEl.addEventListener("submit", submitHandler);
