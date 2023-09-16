import {
  jobListSearchEl,
  jobDetailsContentEl,
  BASE_URL,
  state,
} from "../common.js";
import renderSpinner from "./Spinner.js";
import renderJobDetails from "./JobDetails.js";

const renderJobList = () => {
  jobListSearchEl.innerHTML = "";
  state.searchJobItems
    .slice(state.currentPage * 7 - 7, state.currentPage * 7)
    .forEach((jobItem) => {
      const newJobItemHTML = `
            <li class="job-item">
                <a class="job-item__link" href="${jobItem.id}">
                    <div class="job-item__badge">${jobItem.badgeLetters}</div>
                    <div class="job-item__middle">
                        <h3 class="third-heading">${jobItem.title}</h3>
                        <p class="job-item__company">${jobItem.company}</p>
                        <div class="job-item__extras">
                            <p class="job-item__extra"><i class="fa-solid fa-clock job-item__extra-icon"></i> ${jobItem.duration}</p>
                            <p class="job-item__extra"><i class="fa-solid fa-money-bill job-item__extra-icon"></i> ${jobItem.salary}</p>
                            <p class="job-item__extra"><i class="fa-solid fa-location-dot job-item__extra-icon"></i> ${jobItem.location}</p>
                        </div>
                    </div>
                    <div class="job-item__right">
                        <i class="fa-solid fa-bookmark job-item__bookmark-icon"></i>
                        <time class="job-item__time">${jobItem.daysAgo}d</time>
                    </div>
                </a>
            </li>
        `;
      jobListSearchEl.insertAdjacentHTML("beforeend", newJobItemHTML);
    });
};

const clickHandler = (event) => {
  event.preventDefault();

  const jobItemEl = event.target.closest(".job-item");

  document
    .querySelector(".job-item--active")
    ?.classList.remove("job-item--active");

  jobItemEl.classList.add("job-item--active");

  jobDetailsContentEl.innerHTML = "";

  renderSpinner("Loading job details...");

  const id = jobItemEl.children[0].getAttribute("href");

  fetch(`${BASE_URL}/${id}`)
    .then((response) => {
      if (!response.ok) {
        console.log("Something went wrong");
        return;
      }

      return response.json();
    })
    .then((data) => {
      const { jobItem } = data;

      renderSpinner("Loading job details...");

      renderJobDetails(jobItem);
    })
    .catch((error) => console.log(error));
};

jobListSearchEl.addEventListener("click", clickHandler);

export default renderJobList;
