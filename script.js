const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const result = document.getElementById("result");

let words = [];
let angles = [];
let currentAngle = 0;
let spinning = false;
let spinVelocity = 0;
let targetAngle = 0;

function setupWheel() {
    const input = document.getElementById("input").value;
    words = input.split(",").map(w => w.trim()).filter(Boolean);

    if (words.length < 2) {
        alert("Please enter at least two words.");
        return;
    }

    angles = [];
    const sliceAngle = (2 * Math.PI) / words.length;
    for (let i = 0; i < words.length; i++) {
        angles.push(i * sliceAngle);
    }

    drawWheel();
    result.textContent = "Click spin to start!";
}

function drawWheel() {
    const radius = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const sliceAngle = (2 * Math.PI) / words.length;

    for (let i = 0; i < words.length; i++) {
        // Colorful slices
        const angle = angles[i];
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, angle + currentAngle, angle + sliceAngle + currentAngle);
        ctx.fillStyle = `hsl(${(360 / words.length) * i}, 80%, 70%)`;
        ctx.fill();
        ctx.stroke();

        // Add text
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(angle + sliceAngle / 2 + currentAngle);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(words[i], radius - 10, 5);
        ctx.restore();
    }
}

function spin() {
    if (spinning || words.length < 2) return;

    spinning = true;
    spinVelocity = Math.random() * 0.3 + 0.3; // Initial speed
    const spinTime = Math.random() * 2 + 3; // Spin duration in seconds
    const friction = 0.995;

    function animateSpin() {
        if (spinVelocity <= 0.002) {
            spinning = false;
            showResult();
            return;
        }

        currentAngle += spinVelocity;
        currentAngle %= 2 * Math.PI;
        spinVelocity *= friction;

        drawWheel();
        requestAnimationFrame(animateSpin);
    }

    animateSpin();
}

function showResult() {
    const sliceAngle = (2 * Math.PI) / words.length;
    const index = words.length - Math.floor((currentAngle % (2 * Math.PI)) / sliceAngle) - 2;
    const winningWord = words[index >= 0 ? index : 0];
    result.textContent = `🎉 Winner: ${winningWord}`;
}