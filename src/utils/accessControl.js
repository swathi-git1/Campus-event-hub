const RESTRICTED_ACCESS_TYPES = new Set(['club_only', 'club_specific', 'members_only', 'membership_only'])

export function normalizeAccessType(accessLevel) {
  if (accessLevel === 'college-wide' || accessLevel === 'college_wide' || accessLevel === 'collegeWide') return 'college_wide'
  if (accessLevel === 'club-only' || accessLevel === 'club_only' || accessLevel === 'club_specific') return 'club_only'
  if (accessLevel === 'members-only' || accessLevel === 'members_only' || accessLevel === 'membership_only') return 'members_only'
  return 'public'
}

export function isApprovedClubMember(user, clubName, memberships = []) {
  const email = String(user?.email || '').trim().toLowerCase()
  const club = String(clubName || '').trim().toLowerCase()
  return Boolean(email && club && memberships.some(membership =>
    membership.status === 'approved' &&
    String(membership.studentEmail || '').trim().toLowerCase() === email &&
    String(membership.clubName || '').trim().toLowerCase() === club
  ))
}

export function canViewEvent(event, user, memberships = []) {
  if (!event) return false

  const accessType = normalizeAccessType(event.accessLevel)
  if (!user) return accessType === 'public'
  if (user.role === 'admin') return true

  if (user.role === 'instructor') {
    return String(user.assignedClub || '').trim().toLowerCase() === String(event.club || '').trim().toLowerCase()
  }

  if (user.role !== 'student') return false
  if (accessType === 'public' || accessType === 'college_wide') return true
  return isApprovedClubMember(user, event.club, memberships)
}

export function canRegisterForEvent(event, user, memberships = []) {
  if (!user || user.role !== 'student') return false
  return canViewEvent(event, user, memberships)
}

export function isRestrictedEvent(event) {
  return RESTRICTED_ACCESS_TYPES.has(event?.accessLevel) || ['club-only', 'members-only'].includes(event?.accessLevel)
}