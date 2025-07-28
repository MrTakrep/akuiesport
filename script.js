document.addEventListener('DOMContentLoaded', () => {
    // Tetapkan variabel tanggal_dibuka sesuai permintaan
    const tanggal_dibuka = new Date('2025-08-10T07:00:00');

    // Ambil elemen dari DOM
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    const daysRing = document.getElementById('days-ring');
    const hoursRing = document.getElementById('hours-ring');
    const minutesRing = document.getElementById('minutes-ring');
    const secondsRing = document.getElementById('seconds-ring');

    // Dapatkan radius dan keliling dari lingkaran SVG
    const radius = daysRing.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    // Set keliling sebagai stroke-dasharray untuk semua ring
    [daysRing, hoursRing, minutesRing, secondsRing].forEach(ring => {
        ring.style.strokeDasharray = `${circumference} ${circumference}`;
        ring.style.strokeDashoffset = circumference;
    });

    function updateCountdown() {
        const now = new Date();
        const diff = tanggal_dibuka - now;

        if (diff <= 0) {
            // Countdown selesai
            clearInterval(timer);
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            // Set ring menjadi penuh (atau kosong, tergantung efek yang diinginkan)
            [daysRing, hoursRing, minutesRing, secondsRing].forEach(ring => {
                ring.style.strokeDashoffset = circumference;
            });
            return;
        }

        // Kalkulasi waktu
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const milliseconds = diff % 1000;

        // Update teks angka
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');

        // Update ring progress
        // Untuk pergerakan smooth, kita tambahkan sisa milidetik ke detik
        const totalSecondsLeftInMinute = seconds + milliseconds / 1000;

        // Nilai maksimal untuk setiap unit (untuk kalkulasi persentase ring)
        // Kita asumsikan countdown tidak akan lebih dari 365 hari untuk visualisasi ring hari
        daysRing.style.strokeDashoffset = circumference - (days / 365) * circumference;
        hoursRing.style.strokeDashoffset = circumference - (hours / 24) * circumference;
        minutesRing.style.strokeDashoffset = circumference - (minutes / 60) * circumference;
        secondsRing.style.strokeDashoffset = circumference - (totalSecondsLeftInMinute / 60) * circumference;
    }

    // Panggil fungsi sekali di awal agar tidak ada jeda
    updateCountdown();

    // Set interval untuk update setiap 100 milidetik untuk efek smooth
    const timer = setInterval(updateCountdown, 100);
});