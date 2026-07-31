export async function GET(request) {
    // Obtém o IP do visitante
    const ip =
        request.headers.get("cf-connecting-ip") ||
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        request.headers.get("x-real-ip") ||
        request.headers.get("x-vercel-forwarded-for") ||
        "Desconhecido";

    let vpn = false;
    let proxy = false;
    let tor = false;
    let fraudScore = "N/A";
    let country = "Desconhecido";
    let city = "Desconhecida";
    let isp = "Desconhecido";

    try {
        const response = await fetch(
            `https://ipqualityscore.com/api/json/ip/o0QSrKseZP5TDZH1qoejfwqrnlXJI01k/${ip}`
        );

        const data = await response.json();

        vpn = data.vpn;
        proxy = data.proxy;
        tor = data.tor;
        fraudScore = data.fraud_score;
        country = data.country;
        city = data.city;
        isp = data.ISP;
    } catch (err) {
        console.error(err);
    }

    // Envia para o Discord
    await fetch("https://discord.com/api/webhooks/1507454320076001331/ocskohCih9SY4XInwPLh23m5E8goful_i17-9xvkU2XvcbaAa0GPMn2WM-BAe6VNUvYW", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            embeds: [
                {
                    title: "🌐 Novo acesso ao site",
                    color: vpn || proxy || tor ? 0xff0000 : 0x00ff00,
                    fields: [
                        {
                            name: "IP",
                            value: `\`${ip}\``,
                            inline: false
                        },
                        {
                            name: "Localização",
                            value: `${city}, ${country}`,
                            inline: true
                        },
                        {
                            name: "ISP",
                            value: isp,
                            inline: true
                        },
                        {
                            name: "VPN",
                            value: vpn ? "✅ Sim" : "❌ Não",
                            inline: true
                        },
                        {
                            name: "Proxy",
                            value: proxy ? "✅ Sim" : "❌ Não",
                            inline: true
                        },
                        {
                            name: "Tor",
                            value: tor ? "✅ Sim" : "❌ Não",
                            inline: true
                        },
                        {
                            name: "Fraud Score",
                            value: `${fraudScore}/100`,
                            inline: true
                        }
                    ],
                    timestamp: new Date().toISOString()
                }
            ]
        })
    });

    return Response.json({
        success: true
    });
}
