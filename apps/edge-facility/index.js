const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const customMessage = process.env.CUSTOM_MESSAGE || "Welcome to Edge Facility";
const appVersion = process.env.APP_VERSION || "Dev Build";

// Middleware to parse JSON bodies
app.use(express.json());

// Premium UI Route
app.get('/', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edge Facility Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #ffffff;
            --card-bg: rgba(255, 255, 255, 0.9);
            --text-primary: #0f172a;
            --text-secondary: #64748b;
            --accent-color: #0ea5e9;
            --accent-glow: rgba(14, 165, 233, 0.2);
            --success-color: #16a34a;
        }

        body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-primary);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow: hidden;
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.1) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 40%);
        }

        .container {
            text-align: center;
            position: relative;
            z-index: 1;
        }

        .card {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(0, 0, 0, 0.05);
            border-radius: 24px;
            padding: 4rem 6rem;
            box-shadow: 
                0 25px 50px -12px rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(0, 0, 0, 0.05);
            animation: float 6s ease-in-out infinite;
            max-width: 600px;
            width: 100%;
        }

        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            background: rgba(74, 222, 128, 0.1);
            color: var(--success-color);
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 2rem;
            border: 1px solid rgba(74, 222, 128, 0.2);
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background-color: var(--success-color);
            border-radius: 50%;
            margin-right: 0.5rem;
            box-shadow: 0 0 10px var(--success-color);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
            100% { opacity: 1; transform: scale(1); }
        }

        h1 {
            font-size: 3.5rem;
            font-weight: 800;
            margin: 0 0 1rem 0;
            letter-spacing: -0.025em;
            background: linear-gradient(135deg, #0f172a 0%, #475569 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        p.subtitle {
            color: var(--text-secondary);
            font-size: 1.25rem;
            margin-bottom: 3rem;
            line-height: 1.6;
        }

        .version-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }

        .version-label {
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 0.75rem;
            color: var(--text-secondary);
            font-weight: 600;
        }

        .version-number {
            font-size: 4rem;
            font-weight: 800;
            color: var(--accent-color);
            text-shadow: 0 0 30px var(--accent-glow);
            font-variant-numeric: tabular-nums;
        }

        .footer {
            margin-top: 3rem;
            font-size: 0.875rem;
            color: rgba(148, 163, 184, 0.5);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="status-badge">
                <div class="status-dot"></div>
                SYSTEM OPERATIONAL
            </div>
            
            <h1>Edge Facility Dashboard</h1>
            <p class="subtitle">${customMessage}</p>

            <div class="version-container">
                <span class="version-label">Current Version</span>
                <div class="version-number">${appVersion}</div>
            </div>

            <div class="footer">
                Powered by Glasskube
            </div>
        </div>
    </div>
</body>
</html>
  `;
    res.send(html);
});

// Simulate initiating a distribution task
// In a real scenario, this would trigger Glasskube Distr or similar logic
app.post('/distribute', (req, res) => {
    const { packageName, targetCluster, version } = req.body;

    if (!packageName || !targetCluster) {
        return res.status(400).json({ error: 'packageName and targetCluster are required' });
    }

    console.log(`Simulating distribution request:`);
    console.log(`  Package: ${packageName}`);
    console.log(`  Version: ${version || 'latest'}`);
    console.log(`  Target Cluster: ${targetCluster}`);

    // Simulate asynchronous distribution process
    setTimeout(() => {
        console.log(`Distribution simulation complete for ${packageName} to ${targetCluster}`);
    }, 1500);

    res.status(202).json({
        message: 'Distribution request received and simulation started.',
        details: {
            packageName,
            version: version || 'latest',
            targetCluster,
        }
    });
});

app.listen(port, () => {
    console.log(`Edge Facility listening on port ${port}`);
});
