# Import iPhone progress photos by journal date

NextRep accepts an authenticated photo upload for an exact journal date at:

```text
POST /api/journal-images/by-date
```

The endpoint accepts either a normal multipart image upload or the iPhone-friendly Base64 form:

- `date`: the photo's local capture date in `yyyy-MM-dd` format
- `image_base64`: a Base64-encoded image whose decoded size is up to 5 MB

The date must already exist in the signed-in user's journals. An unmatched date returns HTTP 404 and NextRep does not create a journal or choose a nearby date.

## Build the Apple Shortcut

1. Add **Select Photos** and enable **Select Multiple**.
2. Add **Repeat with Each** using the selected photos.
3. Inside the repeat, add **Get Details of Images**. Choose **Date Taken** from **Repeat Item**.
4. Add **Format Date**. Use **Custom** format `yyyy-MM-dd` and the current time zone.
5. Add **Convert Image**. Convert **Repeat Item** to **JPEG** and turn off metadata preservation if the result is over 5 MB.
6. Add **Base64 Encode**. Encode the converted image and leave line breaks disabled.
7. Add **Get Contents of URL**:
   - URL: `https://nextrep-api.dolved.com/api/journal-images/by-date`
   - Method: `POST`
   - Headers: `Accept: application/json`
   - Headers: `Authorization: Bearer YOUR-NEXTREP-TOKEN`
   - Request Body: `Form`
   - Form field `date`: the formatted date from step 4
   - Text form field `image_base64`: the Base64 result from step 6
   - Text form field `skip_missing`: `1`, so an unmatched date is safely skipped without stopping the remaining batch
8. Below **End Repeat**, add **Show Notification** with the message `Progress photos uploaded to NextRep`.

Use a token returned by `POST /api/login`. Treat it like a password and do not share the Shortcut while the token is embedded in it.

## Quick API check

```bash
curl -X POST 'https://YOUR-NEXTREP-HOST/api/journal-images/by-date' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR-NEXTREP-TOKEN' \
  -F 'date=2026-08-12' \
  -F 'image=@/path/to/progress.jpg'
```

A successful response is HTTP 201 and includes the matched `journal_id`, `journal_date`, full image URL, and thumbnail URL.
