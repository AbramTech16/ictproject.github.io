document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const tableBody = document.querySelector('#students-table tbody');
    const searchInput = document.getElementById('search-name');
    const personalBloodPressure = document.getElementById('personal-blood-pressure');
    const personalTemperature = document.getElementById('personal-temperature');
    const personalMedicationIntake = document.getElementById('personal-medication-intake');
    const personalHealthGraph = document.getElementById('personal-health-graph');

    let studentData = [];

    function updateTable() {
        tableBody.innerHTML = '';
        studentData.forEach(data => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${data.name}</td>
                <td>${data.symptoms}</td>
                <td>${new Date(data.dateTime).toLocaleString()}</td>
                <td>${data.bloodPressure}</td>
                <td>${data.temperature}</td>
                <td>${data.medicationIntake}</td>
            `;
            tableBody.appendChild(newRow);
        });
    }

    function generateGraph(data) {
        if (personalHealthGraph.chart) {
            personalHealthGraph.chart.destroy();
        }
        personalHealthGraph.chart = new Chart(personalHealthGraph, {
            type: 'line',
            data: {
                labels: data.map((_, index) => `Entry ${index + 1}`),
                datasets: [{
                    label: 'Blood Pressure',
                    data: data.map(entry => parseInt(entry.bloodPressure)),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    function displayPersonalHealthData(student) {
        personalBloodPressure.textContent = student.bloodPressure;
        personalTemperature.textContent = student.temperature;
        personalMedicationIntake.textContent = student.medicationIntake;
        generateGraph(student.dataEntries);
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('student-name').value;
        const symptoms = document.getElementById('symptoms').value;
        const dateTime = document.getElementById('date-time').value;
        const bloodPressure = document.getElementById('blood-pressure').value;
        const temperature = document.getElementById('temperature').value;
        const medicationIntake = document.getElementById('medication-intake').value;

        let student = studentData.find(student => student.name === name);
        if (student) {
            student.dataEntries.push({ bloodPressure, dateTime });
            student.symptoms = symptoms;
            student.bloodPressure = bloodPressure;
            student.temperature = temperature;
            student.medicationIntake = medicationIntake;
        } else {
            student = {
                name,
                symptoms,
                dateTime,
                bloodPressure,
                temperature,
                medicationIntake,
                dataEntries: [{ bloodPressure, dateTime }]
            };
            studentData.push(student);
        }

        updateTable();
        form.reset();
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const student = studentData.find(student => student.name.toLowerCase().includes(searchTerm));
        if (student) {
            displayPersonalHealthData(student);
        }
    });
});