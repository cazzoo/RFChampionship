import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Define table types for clarity - replace with actual table types from your Supabase schema if available
type Track = Database['public']['Tables']['tracks']['Row'];
type Vehicle = Database['public']['Tables']['vehicles']['Row'];
type Championship = Database['public']['Tables']['championships']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Event = Database['public']['Tables']['events']['Row'];
type Team = Database['public']['Tables']['teams']['Row'];
type TeamMember = Database['public']['Tables']['team_members']['Row'];
type Registration = Database['public']['Tables']['registrations']['Row'];
type Result = Database['public']['Tables']['results']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'];
type FileMetadata = Database['public']['Tables']['files']['Row'];


// --- MOCK DATA DEFINITIONS ---

/**
 * IMPORTANT: Replace these placeholder UUIDs with the actual UUIDs
 * of an admin user and a regular user that you create in your Supabase Auth dashboard.
 * These are used to link mock data to users.
 */
const MOCK_ADMIN_USER_ID = '00000000-0000-0000-0000-000000000001'; // Replace with actual Admin User UUID
const MOCK_REGULAR_USER_ID = '00000000-0000-0000-0000-000000000002'; // Replace with actual Regular User UUID
const MOCK_ANOTHER_USER_ID = '00000000-0000-0000-0000-000000000003'; // Replace with another actual User UUID

export const mockUsers: Omit<Profile, 'created_at' | 'updated_at' | 'avatar_url' | 'email'>[] = [
  {
    id: MOCK_ADMIN_USER_ID,
    username: 'AdminUser',
    role: 'admin', // Assuming 'admin' is a valid role in your system
    bio: 'The administrator of this fine establishment.',
  },
  {
    id: MOCK_REGULAR_USER_ID,
    username: 'RegularUser',
    role: 'user', // Assuming 'user' is a valid role
    bio: 'A regular user, loves racing.',
  },
  {
    id: MOCK_ANOTHER_USER_ID,
    username: 'AnotherRacer',
    role: 'user',
    bio: 'Just here to race.',
  },
];

export const mockTracks: Omit<Track, 'id' | 'created_at' | 'updated_at'>[] = [
  { name: 'Monza Circuit', location: 'Monza, Italy', length_km: 5.793, configuration: 'Grand Prix', geojson_track_data: null },
  { name: 'Silverstone Circuit', location: 'Silverstone, UK', length_km: 5.891, configuration: 'Grand Prix', geojson_track_data: null },
  { name: 'Spa-Francorchamps', location: 'Stavelot, Belgium', length_km: 7.004, configuration: 'Grand Prix', geojson_track_data: null },
];

export const mockVehicles: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>[] = [
  { name: 'Ferrari 488 GT3', class_or_category: 'GT3' },
  { name: 'Porsche 911 GT3 R', class_or_category: 'GT3' },
  { name: 'Formula Renault 2.0', class_or_category: 'Formula' },
];

export const mockChampionships: Omit<Championship, 'id' | 'created_at' | 'updated_at' | 'logo_url'>[] = [
  { name: 'Global Endurance Championship', description: 'A premier global endurance racing series.', start_date: '2024-03-01', end_date: '2024-11-01', region: 'Global' },
  { name: 'National Touring Cup', description: 'The top national touring car championship.', start_date: '2024-04-01', end_date: '2024-10-01', region: 'National' },
];

// Events, Teams, Registrations etc. will be defined later,
// as they often depend on IDs from the above tables after insertion.

export const seedDatabase = async (supabaseClient: SupabaseClient<Database>, overwrite = false) => {
  console.log(`Starting database seeding. Overwrite mode: ${overwrite}`);

  const tableOrderDelete = [
    'results', 'registrations', 'comments', 'files', 'team_members',
    'events', 'teams', 'championships', 'vehicles', 'tracks', 'profiles'
    // Not deleting from 'auth.users' as that should be managed by the user.
  ];

  const tableOrderInsert = [
    'profiles', 'tracks', 'vehicles', 'championships',
    // Dependent tables will be handled after these base tables are seeded.
  ];

  if (overwrite) {
    console.log('Overwrite mode enabled: Deleting existing data...');
    for (const tableName of tableOrderDelete) {
      try {
        // For 'profiles', only delete mock users if they exist, to avoid deleting all users
        if (tableName === 'profiles') {
            const { error: deleteError } = await supabaseClient
                .from(tableName)
                .delete()
                .in('id', mockUsers.map(u => u.id));
            if (deleteError) throw deleteError;
            console.log(`Mock users deleted from ${tableName}.`);
        } else {
            // For other tables, attempt to delete all data.
            // Consider adding specific filters if you only want to delete "mock" data.
            const { error: deleteError } = await supabaseClient.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000'); // A generic condition to delete all if no specific mock data IDs
            if (deleteError) throw deleteError;
            console.log(`All data deleted from ${tableName}.`);
        }
      } catch (error: any) {
        console.error(`Error deleting data from ${tableName}: ${error.message}`);
        // Decide if you want to stop seeding or continue
      }
    }
    console.log('Data deletion phase completed.');
  }

  // --- SEEDING PROFILES ---
  try {
    console.log('Seeding profiles...');
    const { data: seededUsers, error: userError } = await supabaseClient
      .from('profiles')
      .insert(mockUsers)
      .select(); // .select() to get the inserted data back, including IDs
    if (userError) throw userError;
    console.log(`${seededUsers?.length || 0} users seeded.`);
  } catch (error: any) {
    console.error(`Error seeding profiles: ${error.message}`);
    // If profiles fail, subsequent dependent data might fail or be mislinked.
  }

  // --- SEEDING TRACKS ---
  let seededTracks: Track[] = [];
  try {
    console.log('Seeding tracks...');
    const { data, error } = await supabaseClient.from('tracks').insert(mockTracks).select();
    if (error) throw error;
    seededTracks = data || [];
    console.log(`${seededTracks.length} tracks seeded.`);
  } catch (error: any) {
    console.error(`Error seeding tracks: ${error.message}`);
  }

  // --- SEEDING VEHICLES ---
  let seededVehicles: Vehicle[] = [];
  try {
    console.log('Seeding vehicles...');
    const { data, error } = await supabaseClient.from('vehicles').insert(mockVehicles).select();
    if (error) throw error;
    seededVehicles = data || [];
    console.log(`${seededVehicles.length} vehicles seeded.`);
  } catch (error: any) {
    console.error(`Error seeding vehicles: ${error.message}`);
  }

  // --- SEEDING CHAMPIONSHIPS ---
  let seededChampionships: Championship[] = [];
  try {
    console.log('Seeding championships...');
    const { data, error } = await supabaseClient.from('championships').insert(mockChampionships).select();
    if (error) throw error;
    seededChampionships = data || [];
    console.log(`${seededChampionships.length} championships seeded.`);
  } catch (error: any) {
    console.error(`Error seeding championships: ${error.message}`);
  }

  // --- SEEDING EVENTS (dependent on championships and tracks) ---
  let seededEvents: Event[] = [];
  if (seededChampionships.length > 0 && seededTracks.length > 0) {
    const mockEventsData: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'track_layout_geojson' | 'banner_image_url'>[] = [
      {
        name: 'Monza 6 Hours',
        championship_id: seededChampionships[0].id,
        track_id: seededTracks.find(t => t.name === 'Monza Circuit')?.id || seededTracks[0].id, // Fallback to first track
        start_date: '2024-05-10T10:00:00Z',
        end_date: '2024-05-10T18:00:00Z',
        status: 'upcoming',
        description: 'An exciting 6-hour endurance race at the temple of speed.',
        type: 'Race',
      },
      {
        name: 'Silverstone GP',
        championship_id: seededChampionships[0].id,
        track_id: seededTracks.find(t => t.name === 'Silverstone Circuit')?.id || seededTracks[1].id,
        start_date: '2024-06-15T12:00:00Z',
        end_date: '2024-06-15T14:00:00Z',
        status: 'upcoming',
        description: 'A sprint race at the historic Silverstone.',
        type: 'Race',
      },
      {
        name: 'Spa 24 Hours Practice',
        championship_id: seededChampionships[1].id,
        track_id: seededTracks.find(t => t.name === 'Spa-Francorchamps')?.id || seededTracks[2].id,
        start_date: '2024-07-20T09:00:00Z',
        end_date: '2024-07-20T17:00:00Z',
        status: 'upcoming',
        description: 'Official practice sessions for the Spa 24 Hours.',
        type: 'Practice',
      },
    ];
    try {
      console.log('Seeding events...');
      const { data, error } = await supabaseClient.from('events').insert(mockEventsData).select();
      if (error) throw error;
      seededEvents = data || [];
      console.log(`${seededEvents.length} events seeded.`);
    } catch (error: any) {
      console.error(`Error seeding events: ${error.message}`);
    }
  } else {
    console.warn('Skipping event seeding due to missing championship or track data.');
  }

  // --- SEEDING TEAMS (dependent on users) ---
  let seededTeams: Team[] = [];
  // Ensure mockUsers have been "seeded" or IDs are available
  const mockTeamsData: Omit<Team, 'id' | 'created_at' | 'updated_at' | 'logo_url' | 'banner_url'>[] = [
    { name: 'Velocity Racing', owner_id: MOCK_ADMIN_USER_ID, description: 'Top tier racing team.' }, // Admin owns a team
    { name: 'Endurance Masters', owner_id: MOCK_REGULAR_USER_ID, description: 'Specialists in long races.' }, // Regular user owns a team
  ];
  try {
    console.log('Seeding teams...');
    const { data, error } = await supabaseClient.from('teams').insert(mockTeamsData).select();
    if (error) throw error;
    seededTeams = data || [];
    console.log(`${seededTeams.length} teams seeded.`);
  } catch (error: any) {
    console.error(`Error seeding teams: ${error.message}`);
  }

  // --- SEEDING TEAM MEMBERS (dependent on teams and users) ---
  let seededTeamMembers: TeamMember[] = [];
  if (seededTeams.length > 0) {
    const mockTeamMembersData: Omit<TeamMember, 'id' | 'joined_at'>[] = [
      { team_id: seededTeams[0].id, user_id: MOCK_ADMIN_USER_ID, role: 'Owner' },
      { team_id: seededTeams[0].id, user_id: MOCK_REGULAR_USER_ID, role: 'Driver' },
      { team_id: seededTeams[1].id, user_id: MOCK_REGULAR_USER_ID, role: 'Owner' },
      { team_id: seededTeams[1].id, user_id: MOCK_ANOTHER_USER_ID, role: 'Driver' },
    ];
    try {
      console.log('Seeding team members...');
      const { data, error } = await supabaseClient.from('team_members').insert(mockTeamMembersData).select();
      if (error) throw error;
      seededTeamMembers = data || [];
      console.log(`${seededTeamMembers.length} team members seeded.`);
    } catch (error: any) {
      console.error(`Error seeding team members: ${error.message}`);
    }
  } else {
    console.warn('Skipping team member seeding due to missing team data.');
  }

  // --- SEEDING REGISTRATIONS (dependent on events, users, teams, vehicles) ---
  let seededRegistrations: Registration[] = [];
  if (seededEvents.length > 0 && seededTeams.length > 0 && seededVehicles.length > 0) {
    const mockRegistrationsData: Omit<Registration, 'id' | 'registered_at' | 'status'>[] = [
      {
        event_id: seededEvents[0].id,
        user_id: MOCK_REGULAR_USER_ID, // RegularUser registers for Monza 6 Hours
        team_id: seededTeams[0].id, // With Velocity Racing
        vehicle_id: seededVehicles[0].id, // Ferrari 488 GT3
        number: '77',
        championship_id: seededEvents[0].championship_id,
      },
      {
        event_id: seededEvents[1].id,
        user_id: MOCK_ANOTHER_USER_ID, // AnotherRacer for Silverstone GP
        team_id: seededTeams[1].id, // With Endurance Masters
        vehicle_id: seededVehicles[1].id, // Porsche 911 GT3 R
        number: '88',
        championship_id: seededEvents[1].championship_id,
      },
    ];
    try {
      console.log('Seeding registrations...');
      const { data, error } = await supabaseClient.from('registrations').insert(mockRegistrationsData).select();
      if (error) throw error;
      seededRegistrations = data || [];
      console.log(`${seededRegistrations.length} registrations seeded.`);
    } catch (error: any) {
      console.error(`Error seeding registrations: ${error.message}`);
    }
  } else {
    console.warn('Skipping registration seeding due to missing prerequisite data.');
  }

  // --- SEEDING RESULTS (dependent on registrations, events, users, teams, vehicles) ---
  let seededResults: Result[] = [];
  if (seededRegistrations.length > 0) {
    const mockResultsData: Omit<Result, 'id' | 'created_at' | 'updated_at'>[] = [
      {
        registration_id: seededRegistrations[0].id, // Result for RegularUser at Monza
        event_id: seededRegistrations[0].event_id,
        team_id: seededRegistrations[0].team_id,
        vehicle_id: seededRegistrations[0].vehicle_id,
        user_id: seededRegistrations[0].user_id,
        position: 1,
        points: 25,
        race_number: seededRegistrations[0].number,
        lap_time_best: '1:47.500',
        laps_completed: 180,
        status: 'Finished',
      },
      // Add another result for the second registration if desired
    ];
     try {
      console.log('Seeding results...');
      const { data, error } = await supabaseClient.from('results').insert(mockResultsData).select();
      if (error) throw error;
      seededResults = data || [];
      console.log(`${seededResults.length} results seeded.`);
    } catch (error: any) {
      console.error(`Error seeding results: ${error.message}`);
    }
  } else {
      console.warn('Skipping results seeding due to missing registration data.');
  }

  // --- SEEDING COMMENTS (dependent on users, events/championships) ---
  let seededComments: Comment[] = [];
  if (seededEvents.length > 0 && seededChampionships.length > 0) {
    const mockCommentsData: Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'parent_comment_id'>[] = [
      {
        user_id: MOCK_REGULAR_USER_ID,
        entity_type: 'event',
        entity_id_int: seededEvents[0].id, // Comment on Monza 6 Hours
        content: 'Looking forward to this race! Monza is iconic.',
      },
      {
        user_id: MOCK_ADMIN_USER_ID,
        entity_type: 'championship',
        entity_id_int: seededChampionships[0].id, // Comment on Global Endurance Championship
        content: 'The GEC is going to be action-packed this year.',
      },
    ];
    try {
      console.log('Seeding comments...');
      const { data, error } = await supabaseClient.from('comments').insert(mockCommentsData).select();
      if (error) throw error;
      seededComments = data || [];
      console.log(`${seededComments.length} comments seeded.`);
    } catch (error: any) {
      console.error(`Error seeding comments: ${error.message}`);
    }
  } else {
    console.warn('Skipping comment seeding due to missing event or championship data.');
  }

  // --- SEEDING FILES (metadata only) ---
  let seededFiles: FileMetadata[] = [];
  if (seededEvents.length > 0) {
    const mockFilesData: Omit<FileMetadata, 'id' | 'created_at' | 'updated_at' | 'version_of_file_id' | 'metadata' | 'tags' | 'title' | 'description' | 'entity_id_uuid'>[] = [
      {
        uploader_user_id: MOCK_ADMIN_USER_ID,
        storage_bucket: 'event-banners',
        storage_path: `public/event-banners/${seededEvents[0].id}/monza_banner.jpg`,
        original_file_name: 'monza_banner.jpg',
        mime_type: 'image/jpeg',
        file_size_bytes: 120000,
        upload_status: 'completed',
        entity_type: 'event_banner',
        entity_id_int: seededEvents[0].id,
      },
      {
        uploader_user_id: MOCK_REGULAR_USER_ID,
        storage_bucket: 'team-logos',
        storage_path: `public/team-logos/${seededTeams[0]?.id}/velocity_logo.png`, // Assuming seededTeams[0] exists
        original_file_name: 'velocity_logo.png',
        mime_type: 'image/png',
        file_size_bytes: 50000,
        upload_status: 'completed',
        entity_type: 'team_logo',
        entity_id_int: seededTeams[0]?.id,
      },
    ];
    try {
      console.log('Seeding files (metadata)...');
      const { data, error } = await supabaseClient.from('files').insert(mockFilesData).select();
      if (error) throw error;
      seededFiles = data || [];
      console.log(`${seededFiles.length} file metadata records seeded.`);
    } catch (error: any) {
      console.error(`Error seeding file metadata: ${error.message}`);
    }
  } else {
    console.warn('Skipping file metadata seeding due to missing event or team data.');
  }

  console.log('Database seeding process completed.');
};
