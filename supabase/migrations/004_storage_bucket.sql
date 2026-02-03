-- Create a new private bucket 'avatars'
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Policy to allow authenticated uploads to 'avatars'
create policy "Authenticated users can upload avatars"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'avatars' );

-- Policy to allow public to view avatars
create policy "Public can view avatars"
on storage.objects for select
to public
using ( bucket_id = 'avatars' );

-- Policy to allow users to update their own avatars
create policy "Users can update their own avatars"
on storage.objects for update
to authenticated
using ( bucket_id = 'avatars' );
