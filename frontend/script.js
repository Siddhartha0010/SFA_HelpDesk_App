document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const navbarToggler = document.querySelector(".navbar-toggler")
  const navbarCollapse = document.querySelector(".navbar-collapse")

  if (navbarToggler) {
    navbarToggler.addEventListener("click", () => {
      navbarCollapse.classList.toggle("show")
    })
  }

  // Feature Card Toggle
  const featureCards = document.querySelectorAll(".feature-card")

  featureCards.forEach((card) => {
    const content = card.querySelector(".feature-content")
    const details = card.querySelector(".feature-details")

    if (content && details) {
      content.addEventListener("click", (e) => {
        // Don't toggle if clicking on the tutorial button
        if (
          e.target.classList.contains("btn-tutorial") ||
          e.target.closest(".btn-tutorial") ||
          e.target.closest(".feature-actions")
        ) {
          return
        }

        // Toggle details visibility
        if (details.style.display === "block") {
          details.style.display = "none"
        } else {
          // Hide all other details first
          document.querySelectorAll(".feature-details").forEach((detail) => {
            detail.style.display = "none"
          })

          details.style.display = "block"
        }
      })
    }
  })

  // FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question")

    if (question) {
      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active")
        faqItems.forEach((faq) => {
          faq.classList.remove("active")
        })
        if (!isActive) {
          item.classList.add("active")
        }
      })
    }
  })

  // Tutorial Filter
  const filterBtns = document.querySelectorAll(".filter-btn")
  const tutorialItems = document.querySelectorAll(".tutorial-item")

  if (filterBtns.length > 0 && tutorialItems.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        filterBtns.forEach((filterBtn) => {
          filterBtn.classList.remove("active")
        })

        this.classList.add("active")

        const filter = this.getAttribute("data-filter")

        tutorialItems.forEach((item) => {
          if (filter === "all" || item.getAttribute("data-category") === filter) {
            item.style.display = "block"
          } else {
            item.style.display = "none"
          }
        })
      })
    })
  }

  // User language preference
  let userLanguage = localStorage.getItem("preferredLanguage") || "english"

  // Language selector buttons
  const languageButtons = document.querySelectorAll(".btn-language")

  if (languageButtons.length > 0) {
    languageButtons.forEach((btn) => {
      if (btn.getAttribute("data-language") === userLanguage) {
        btn.classList.add("active")
      } else {
        btn.classList.remove("active")
      }
    })

    languageButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        languageButtons.forEach((b) => b.classList.remove("active"))
        this.classList.add("active")
        userLanguage = this.getAttribute("data-language")
        localStorage.setItem("preferredLanguage", userLanguage)

        const videoModal = document.getElementById("videoModal")
        if (videoModal && videoModal.classList.contains("show")) {
          const tutorialVideo = document.getElementById("tutorialVideo")
          if (tutorialVideo) {
            const activeButton = document.querySelector(
              ".play-button[data-active='true'], .watch-tutorial[data-active='true'], .tutorial-link[data-active='true']",
            )

            if (activeButton) {
              const videoLinkEnglish =
                activeButton.getAttribute("data-video-link-english") ||
                activeButton.getAttribute("data-video-link") ||
                activeButton.getAttribute("href")
              const videoLinkTelugu =
                activeButton.getAttribute("data-video-link-telugu") ||
                activeButton.getAttribute("data-video-link") ||
                activeButton.getAttribute("href")

              const videoLink = userLanguage === "english" ? videoLinkEnglish : videoLinkTelugu

              if (tutorialVideo.querySelector("source")) {
                tutorialVideo.querySelector("source").src = videoLink
              } else {
                tutorialVideo.src = videoLink
              }

              tutorialVideo.load()
              tutorialVideo.play().catch((e) => console.log("Auto-play prevented by browser:", e))
            }
          }
        }
      })
    })
  }

  // Video Modal
  const videoModal = document.getElementById("videoModal")
  const tutorialVideo = document.getElementById("tutorialVideo")
  const modalTitle = document.getElementById("modalTitle")

  // Play buttons in tutorial cards
  const playButtons = document.querySelectorAll(".play-button")

  if (playButtons.length > 0 && videoModal) {
    playButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const videoLinkEnglish = this.getAttribute("data-video-link-english") || this.getAttribute("data-video-link")
        const videoLinkTelugu = this.getAttribute("data-video-link-telugu") || this.getAttribute("data-video-link")
        const card = this.closest(".tutorial-card")
        const title = card ? card.querySelector("h3").textContent : "Video Tutorial"

        if (modalTitle) modalTitle.textContent = title

        if (tutorialVideo) {
          const userLanguage = localStorage.getItem("preferredLanguage") || "english"
          const videoLink = userLanguage === "english" ? videoLinkEnglish : videoLinkTelugu

          const videoSource = tutorialVideo.querySelector("source")
          if (videoSource) {
            videoSource.src = videoLink
            tutorialVideo.load()
          } else {
            tutorialVideo.src = videoLink
            tutorialVideo.load()
          }
        }

        const modal = window.bootstrap.Modal.getOrCreateInstance(videoModal)
        markActiveButton(this)
        modal.show()
      })
    })
  }

  // Tutorial links in FAQ
  const tutorialLinks = document.querySelectorAll(".tutorial-link")

  if (tutorialLinks.length > 0 && videoModal) {
    tutorialLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()

        const videoLinkEnglish = this.getAttribute("data-video-link-english") || this.getAttribute("href")
        const videoLinkTelugu = this.getAttribute("data-video-link-telugu") || this.getAttribute("href")
        const faqItem = this.closest(".faq-item")
        const title = faqItem ? faqItem.querySelector("h3").textContent + " Tutorial" : "Video Tutorial"

        if (modalTitle) modalTitle.textContent = title

        if (tutorialVideo) {
          const userLanguage = localStorage.getItem("preferredLanguage") || "english"
          const videoLink = userLanguage === "english" ? videoLinkEnglish : videoLinkTelugu

          const videoSource = tutorialVideo.querySelector("source")
          if (videoSource) {
            videoSource.src = videoLink
            tutorialVideo.load()
          } else {
            tutorialVideo.src = videoLink
            tutorialVideo.load()
          }
        }

        const modal = window.bootstrap.Modal.getOrCreateInstance(videoModal)
        markActiveButton(this)
        modal.show()
      })
    })
  }

  // Close modal and stop video when modal is closed
  if (videoModal) {
    videoModal.addEventListener("hidden.bs.modal", () => {
      if (tutorialVideo) {
        tutorialVideo.pause()
        tutorialVideo.currentTime = 0
        const videoSource = tutorialVideo.querySelector("source")
        if (videoSource) {
          videoSource.src = ""
        } else {
          tutorialVideo.src = ""
        }
        tutorialVideo.load()
      }
    })
  }

  // Add a function to mark the active button when a video is played
  function markActiveButton(button) {
    document
      .querySelectorAll(
        ".play-button[data-active='true'], .watch-tutorial[data-active='true'], .tutorial-link[data-active='true']",
      )
      .forEach((btn) => {
        btn.removeAttribute("data-active")
      })
    button.setAttribute("data-active", "true")
  }

  // Form Submission
  const supportForm = document.getElementById("support-form")

  if (supportForm) {
    supportForm.addEventListener("submit", async function (e) {
      e.preventDefault() // Stop the page from reloading.

      const submitBtn = this.querySelector("button[type='submit']")
      const originalText = submitBtn.textContent

      submitBtn.disabled = true
      submitBtn.textContent = "Submitting..."

      // Gather all the information from your form fields.
      // Keys MUST match your backend Mongoose schema field names exactly.
      const formData = {
        name: document.getElementById("name").value,
        employeeId: document.getElementById("employee-id").value,
        email: document.getElementById("email").value,
        category: document.getElementById("issue-type").value, // Corrected key to 'category'
        subject: document.getElementById("subject").value,
        description: document.getElementById("description").value,
        // The 'screenshot' input is a file input and needs a different API (FormData) to send.
        // It cannot be sent directly as JSON. Left out for now.
      }

      try {
        const response = await fetch("https://sfa-helpdesk-app.onrender.com/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (response.ok) {
          alert(data.message)
          this.reset() // Clear all the text you typed in the form.
        } else {
          // Display the specific error message from the backend if available
          alert(`Submission failed: ${data.message || "Server error, please try again later."}`)
        }
      } catch (error) {
        console.error("Error:", error) // This shows the error in your browser's developer console.
        alert("An error occurred during submission. Please check your internet connection or backend server status.")
      } finally {
        submitBtn.disabled = false
        submitBtn.textContent = originalText
      }
    })
  }
})
