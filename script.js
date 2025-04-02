const bills = [
      {
        billId: "HR1234",
        title: "Education Reform Act",
        chamber: "House",
        status: "In Committee",
        sponsors: ["Rep. Jane Doe (D-CA)"],
        summary: "Expands federal funding for community colleges and trade schools."
      },
      {
        billId: "HR5678",
        title: "Climate Action Act",
        chamber: "House",
        status: "Passed",
        sponsors: ["Rep. John Smith (R-TX)"],
        summary: "Mandates net-zero emissions standards for all federal buildings by 2030."
      },
      {
        billId: "S4321",
        title: "Healthcare Improvement Act",
        chamber: "Senate",
        status: "In Committee",
        sponsors: ["Sen. Alice Johnson (I-VT)"],
        summary: "Expands Medicare coverage for low-income seniors."
      },
      {
        billId: "S8765",
        title: "Tax Reform Act",
        chamber: "Senate",
        status: "Passed",
        sponsors: ["Sen. Bob Williams (D-NY)"],
        summary: "Simplifies the tax code and lowers corporate tax rates."
      }
    ];

    function createBillCard(bill) {
      const sectionSelector = `.${bill.status === "Passed" ? "status-passed" : "status-in-committee"}`
                            + `.${bill.chamber.toLowerCase()}-section`;

      const container = document.querySelector(sectionSelector);

      const card = document.createElement('div');
      card.classList.add('bill-card');
      card.classList.add(`status-${bill.status.toLowerCase().replace(/\s+/g, '-')}`);

      const title = document.createElement('h4');
      title.textContent = `${bill.billId} – ${bill.title}`;
      card.appendChild(title);

      const details = document.createElement('div');
      details.classList.add('details');

      const sponsorP = document.createElement('p');
      sponsorP.innerHTML = `<strong>Sponsor:</strong> ${bill.sponsors.join(', ')}`;
      details.appendChild(sponsorP);

      const summaryP = document.createElement('p');
      summaryP.textContent = bill.summary;
      details.appendChild(summaryP);

      card.appendChild(details);

      card.addEventListener('click', () => {
        card.classList.toggle('expanded');
      });

      container.appendChild(card);
    }

    bills.forEach(bill => createBillCard(bill))