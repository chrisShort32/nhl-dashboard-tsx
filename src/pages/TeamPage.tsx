const betSummaryByTeam = summarizeBetResults<string>(filtered, 'team', { includeTotals: false })
    betSummaryByTeam.sort((a, b) => {
        const av = a.hit_rate
        const bv = b.hit_rate
        return av - bv
    })