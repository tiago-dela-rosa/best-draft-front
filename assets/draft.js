const draftSettings = {
  stages(order) {
    let firstTeam
    let secondTeam

    if (order === 'first') {
      firstTeam = 'order'
      secondTeam = 'chaos'
    }

    if (order === 'second') {
      firstTeam = 'chaos'
      secondTeam = 'order'
    }

    return [
      {
        team: firstTeam,
        id: 1,
        type: 'ban',
        action: 'single',
        sequence: 1,
        godSelected: {}
      },
      {
        team: secondTeam,
        id: 2,
        type: 'ban',
        action: 'single',
        sequence: 2,
        godSelected: {}
      },
      {
        team: firstTeam,
        id: 3,
        type: 'ban',
        action: 'single',
        sequence: 3,
        godSelected: {}
      },
      {
        team: secondTeam,
        id: 4,
        type: 'ban',
        action: 'single',
        sequence: 4,
        godSelected: {}
      },
      {
        team: firstTeam,
        id: 5,
        type: 'ban',
        action: 'single',
        sequence: 5,
        godSelected: {}
      },
      {
        team: secondTeam,
        id: 6,
        type: 'ban',
        action: 'single',
        sequence: 6,
        godSelected: {}
      },
      {
        team: firstTeam,
        id: 7,
        type: 'pick',
        action: 'single',
        sequence: 7,
        godSelected: {}
      },
      {
        team: secondTeam,
        id: 8,
        type: 'pick',
        action: 'double',
        sequence: 8,
        godSelected: {}
      },
      {
        team: secondTeam,
        id: 9,
        type: 'pick',
        action: 'double',
        sequence: 9,
        godSelected: {}
      },
      {
        team: firstTeam,
        id: 10,
        type: 'pick',
        action: 'double',
        sequence: 10,
        godSelected: {}
      },
      {
        team: firstTeam,
        id: 11,
        type: 'pick',
        action: 'double',
        sequence: 11,
        godSelected: {}
      },
      {
        team: secondTeam,
        id: 12,
        type: 'pick',
        action: 'single',
        sequence: 12,
        godSelected: {}
      },
      {
        team: secondTeam,
        id: 13,
        type: 'ban',
        action: 'single',
        sequence: 13,
        godSelected: {}
      },
      {
        team: firstTeam,
        id: 14,
        type: 'ban',
        action: 'single',
        sequence: 14,
        godSelected: {}
      },
      {
        team: secondTeam,
        id: 15,
        type: 'ban',
        action: 'single',
        sequence: 15,
        godSelected: {}
      },
      {
        team: firstTeam,
        id: 16,
        type: 'ban',
        action: 'single',
        sequence: 16,
        godSelected: {}
      },
      {
        team: secondTeam,
        id: 17,
        type: 'pick',
        action: 'single',
        sequence: 17,
        godSelected: {}
      },
      {
        team: firstTeam,
        id: 18,
        type: 'pick',
        action: 'double',
        sequence: 18,
        godSelected: {}
      },
      {
        team: firstTeam,
        id: 19,
        type: 'pick',
        action: 'double',
        sequence: 19,
        godSelected: {}
      },
      {
        team: secondTeam,
        id: 20,
        type: 'pick',
        action: 'single',
        sequence: 20,
        godSelected: {}
      }
    ]
  }
}

export const { stages } = draftSettings
