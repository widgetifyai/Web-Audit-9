# WebAuditNine Website Audit Reports

WebAuditNine is a website auditing platform that evaluates websites across key areas such as SEO, accessibility, mobile experience, security, performance, user experience, conversion optimization, and best practices.

## Audit Reports
# Website Audit Directory

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Website Audit Directory</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background: #0d141c;
      color: #f1f5f9;
      font-family: Inter, Arial, sans-serif;
      padding: 28px;
    }

    .directory-grid {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .audit-card {
      background: linear-gradient(135deg, #19232d, #161f28);
      border: 1px solid #2c3945;
      border-radius: 28px;
      padding: 26px;
      min-height: 210px;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .audit-card:hover {
      transform: translateY(-4px);
      border-color: #3dd5b1;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .website-name {
      font-size: 22px;
      font-weight: 700;
      color: #f4efe8;
      margin-bottom: 6px;
    }

    .website-description {
      color: #a7b4c2;
      font-size: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 330px;
    }

    .score {
      color: #42d3b2;
      font-size: 34px;
      font-weight: 800;
      line-height: 1;
    }

    .progress-track {
      width: 100%;
      height: 7px;
      background: #25313d;
      border-radius: 20px;
      margin: 18px 0;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: #42d3b2;
      border-radius: inherit;
    }

    .badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
    }

    .badge {
      background: #25313d;
      color: #dbe5ee;
      padding: 7px 14px;
      border-radius: 999px;
      font-size: 14px;
      white-space: nowrap;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
    }

    .report-link,
    .directory-link {
      text-decoration: none;
      font-size: 16px;
      transition: opacity 0.2s ease;
    }

    .report-link {
      color: #45d8b6;
      font-weight: 500;
    }

    .directory-link {
      color: #a7b4c2;
    }

    .report-link:hover,
    .directory-link:hover {
      opacity: 0.75;
    }

    @media (max-width: 1000px) {
      .directory-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 650px) {
      body {
        padding: 16px;
      }

      .directory-grid {
        grid-template-columns: 1fr;
      }

      .audit-card {
        padding: 22px;
      }

      .website-name {
        font-size: 20px;
      }
    }
  </style>
</head>

<body>

  <main class="directory-grid" id="directory"></main>

  <script>
    const websites = [
      {
        name: "blissclub.com",
        description: "Functional Apparel for Women & Men",
        score: 88,
        metrics: [
          "SEO 99",
          "Conversion Optimization 99",
          "Security 99"
        ],
        reportUrl: "https://webauditnine.vercel.app/report/blissclub-com-mt0a8zbz?d=eyJpZCI6ImJsaXNzY2x1Yi1jb20tbXQwYTh6YnoiLCJ1cmwiOiJodHRwczovL2JsaXNzY2x1Yi5jb20vIiwidGl0bGUiOiJGdW5jdGlvbmFsIEFwcGFyZWwgZm9yIFdvbWVuICZhbXA7IE1lbiBieSBCbGlzc0NsdWIiLCJob3N0bmFtZSI6ImJsaXNzY2x1Yi5jb20iLCJvdmVyYWxsU2NvcmUiOjg4LCJjYXRlZ29yaWVzIjpbeyJpZCI6InNlbyIsIm5hbWUiOiJTRU8iLCJzY29yZSI6OTksInN1bW1hcnkiOiIiLCJmaW5kaW5ncyI6W10sImJ1c2luZXNzSW1wYWN0IjoiIiwid2h5SXRNYXR0ZXJzIjoiIiwiaW1wcm92ZW1lbnRzIjpbXSwiZGlmZmljdWx0eSI6IkVhc3kiLCJwcmlvcml0eSI6IkxvdyJ9LHsiaWQiOiJjb252ZXJzaW9uIiwibmFtZSI6IkNvbnZlcnNpb24gT3B0aW1pemF0aW9uIiwic2NvcmUiOjk5LCJzdW1tYXJ5IjoiIiwiZmluZGluZ3MiOltdLCJidXNpbmVzc0ltcGFjdCI6IiIsIndoeUl0TWF0dGVycyI6IiIsImltcHJvdmVtZW50cyI6W10sImRpZmZpY3VsdHkiOiJFYXN5IiwicHJpb3JpdHkiOiJMb3cifSx7ImlkIjoic2VjdXJpdHkiLCJuYW1lIjoiU2VjdXJpdHkiLCJzY29yZSI6OTksInN1bW1hcnkiOiIiLCJmaW5kaW5ncyI6W10sImJ1c2luZXNzSW1wYWN0IjoiIiwid2h5SXRNYXR0ZXJzIjoiIiwiaW1wcm92ZW1lbnRzIjpbXSwiZGlmZmljdWx0eSI6IkVhc3kiLCJwcmlvcml0eSI6IkxvdyJ9LHsiaWQiOiJ1eCIsIm5hbWUiOiJVc2VyIEV4cGVyaWVuY2UiLCJzY29yZSI6OTYsInN1bW1hcnkiOiIiLCJmaW5kaW5ncyI6W10sImJ1c2luZXNzSW1wYWN0IjoiIiwid2h5SXRNYXR0ZXJzIjoiIiwiaW1wcm92ZW1lbnRzIjpbXSwiZGlmZmljdWx0eSI6IkVhc3kiLCJwcmlvcml0eSI6IkxvdyJ9LHsiaWQiOiJtb2JpbGUiLCJuYW1lIjoiTW9iaWxlIEV4cGVyaWVuY2UiLCJzY29yZSI6ODgsInN1bW1hcnkiOiIiLCJmaW5kaW5ncyI6W10sImJ1c2luZXNzSW1wYWN0IjoiIiwid2h5SXRNYXR0ZXJzIjoiIiwiaW1wcm92ZW1lbnRzIjpbXSwiZGlmZmljdWx0eSI6IkVhc3kiLCJwcmlvcml0eSI6IkxvdyJ9LHsiaWQiOiJiZXN0LXByYWN0aWNlcyIsIm5hbWUiOiJCZXN0IFByYWN0aWNlcyIsInNjb3JlIjo4OCwic3VtbWFyeSI6IiIsImZpbmRpbmdzIjpbXSwiYnVzaW5lc3NJbXBhY3QiOiIiLCJ3aHlJdE1hdHRlcnMiOiIiLCJpbXByb3ZlbWVudHMiOltdLCJkaWZmaWN1bHR5IjoiRWFzeSIsInByaW9yaXR5IjoiTG93In0seyJpZCI6ImFjY2Vzc2liaWxpdHkiLCJuYW1lIjoiQWNjZXNzaWJpbGl0eSIsInNjb3JlIjo4Mywic3VtbWFyeSI6IiIsImZpbmRpbmdzIjpbXSwiYnVzaW5lc3NJbXBhY3QiOiIiLCJ3aHlJdE1hdHRlcnMiOiIiLCJpbXByb3ZlbWVudHMiOltdLCJkaWZmaWN1bHR5IjoiRWFzeSIsInByaW9yaXR5IjoiTG93In0seyJpZCI6InBlcmZvcm1hbmNlIiwibmFtZSI6IlBlcmZvcm1hbmNlIiwic2NvcmUiOjU0LCJzdW1tYXJ5IjoiIiwiZmluZGluZ3MiOltdLCJidXNpbmVzc0ltcGFjdCI6IiIsIndoeUl0TWF0dGVycyI6IiIsImltcHJvdmVtZW50cyI6W10sImRpZmZpY3VsdHkiOiJFYXN5IiwicHJpb3JpdHkiOiJMb3cifV0sImNyZWF0ZWRBdCI6IjIwMjYtMDgtMTlUMTY6MDU6MTMuMzI0WiIsImZhdm9yaXRlIjpmYWxzZSwicmVjb21tZW5kYXRpb25zIjpbXSwic3RyZW5ndGhzIjpbXSwid2Vha25lc3NlcyI6W10sImV4ZWN1dGl2ZVN1bW1hcnkiOiIiLCJhaVBvd2VyZWQiOmZhbHNlfQ",
        websiteUrl: "https://blissclub.com"
      },
      {
        name: "goatlife.co.in",
        description: "GOAT Life",
        score: 87,
        metrics: [
          "SEO 99",
          "Security 99",
          "User Experience 96"
        ],
        reportUrl: "https://webauditnine.vercel.app/report/goatlife-co-in-mt047ux6?d=eyJpZCI6ImdvYXRsaWZlLWNvLWluLW10MDQ3dXg2IiwidXJsIjoiaHR0cHM6Ly9nb2F0bGlmZS5jby5pbi8iLCJ0aXRsZSI6IkdPQVQgTGlmZSAmbmRhc2g7IEdvYXQgbGlmZSIsImhvc3RuYW1lIjoiZ29hdGxpZmUuY28uaW4iLCJvdmVyYWxsU2NvcmUiOjg3LCJjYXRlZ29yaWVzIjpbeyJpZCI6InNlbyIsIm5hbWUiOiJTRU8iLCJzY29yZSI6OTksInN1bW1hcnkiOiIiLCJmaW5kaW5ncyI6W10sImJ1c2luZXNzSW1wYWN0IjoiIiwid2h5SXRNYXR0ZXJzIjoiIiwiaW1wcm92ZW1lbnRzIjpbXSwiZGlmZmljdWx0eSI6IkVhc3kiLCJwcmlvcml0eSI6IkxvdyJ9LHsiaWQiOiJzZWN1cml0eSIsIm5hbWUiOiJTZWN1cml0eSIsInNjb3JlIjo5OSwic3VtbWFyeSI6IiIsImZpbmRpbmdzIjpbXSwiYnVzaW5lc3NJbXBhY3QiOiIiLCJ3aHlJdE1hdHRlcnMiOiIiLCJpbXByb3ZlbWVudHMiOltdLCJkaWZmaWN1bHR5IjoiRWFzeSIsInByaW9yaXR5IjoiTG93In0seyJpZCI6InV4IiwibmFtZSI6IlVzZXIgRXhwZXJpZW5jZSIsInNjb3JlIjo5Niwic3VtbWFyeSI6IiIsImZpbmRpbmdzIjpbXSwiYnVzaW5lc3NJbXBhY3QiOiIiLCJ3aHlJdE1hdHRlcnMiOiIiLCJpbXByb3ZlbWVudHMiOltdLCJkaWZmaWN1bHR5IjoiRWFzeSIsInByaW9yaXR5IjoiTG93In0seyJpZCI6ImNvbnZlcnNpb24iLCJuYW1lIjoiQ29udmVyc2lvbiBPcHRpbWl6YXRpb24iLCJzY29yZSI6OTMsInN1bW1hcnkiOiIiLCJmaW5kaW5ncyI6W10sImJ1c2luZXNzSW1wYWN0IjoiIiwid2h5SXRNYXR0ZXJzIjoiIiwiaW1wcm92ZW1lbnRzIjpbXSwiZGlmZmljdWx0eSI6IkVhc3kiLCJwcmlvcml0eSI6IkxvdyJ9LHsiaWQiOiJhY2Nlc3NpYmlsaXR5IiwibmFtZSI6IkFjY2Vzc2liaWxpdHkiLCJzY29yZSI6ODgsInN1bW1hcnkiOiIiLCJmaW5kaW5ncyI6W10sImJ1c2luZXNzSW1wYWN0IjoiIiwid2h5SXRNYXR0ZXJzIjoiIiwiaW1wcm92ZW1lbnRzIjpbXSwiZGlmZmljdWx0eSI6IkVhc3kiLCJwcmlvcml0eSI6IkxvdyJ9LHsiaWQiOiJtb2JpbGUiLCJuYW1lIjoiTW9iaWxlIEV4cGVyaWVuY2UiLCJzY29yZSI6ODgsInN1bW1hcnkiOiIiLCJmaW5kaW5ncyI6W10sImJ1c2luZXNzSW1wYWN0IjoiIiwid2h5SXRNYXR0ZXJzIjoiIiwiaW1wcm92ZW1lbnRzIjpbXSwiZGlmZmljdWx0eSI6IkVhc3kiLCJwcmlvcml0eSI6IkxvdyJ9LHsiaWQiOiJiZXN0LXByYWN0aWNlcyIsIm5hbWUiOiJCZXN0IFByYWN0aWNlcyIsInNjb3JlIjo4Miwic3VtbWFyeSI6IiIsImZpbmRpbmdzIjpbXSwiYnVzaW5lc3NJbXBhY3QiOiIiLCJ3aHlJdE1hdHRlcnMiOiIiLCJpbXByb3ZlbWVudHMiOltdLCJkaWZmaWN1bHR5IjoiRWFzeSIsInByaW9yaXR5IjoiTG93In0seyJpZCI6InBlcmZvcm1hbmNlIiwibmFtZSI6IlBlcmZvcm1hbmNlIiwic2NvcmUiOjU0LCJzdW1tYXJ5IjoiIiwiZmluZGluZ3MiOltdLCJidXNpbmVzc0ltcGFjdCI6IiIsIndoeUl0TWF0dGVycyI6IiIsImltcHJvdmVtZW50cyI6W10sImRpZmZpY3VsdHkiOiJFYXN5IiwicHJpb3JpdHkiOiJMb3cifV0sImNyZWF0ZWRBdCI6IjIwMjYtMDgtMTlUMTM6MTY6MjMuMTg4WiIsImZhdm9yaXRlIjpmYWxzZSwicmVjb21tZW5kYXRpb25zIjpbXSwic3RyZW5ndGhzIjpbXSwid2Vha25lc3NlcyI6W10sImV4ZWN1dGl2ZVN1bW1hcnkiOiIiLCJhaVBvd2VyZWQiOmZhbHNlfQ",
        websiteUrl: "https://goatlife.co.in"
      },
      {
        name: "in.puma.com",
        description: "PUMA.COM Forever Faster | PUMA India",
        score: 87,
        metrics: [
          "SEO 99",
          "Accessibility 99",
          "User Experience 96"
        ],
        reportUrl: "https://webauditnine.vercel.app/report/in-puma-com-msuy6lwm?d=eyJpZCI6ImluLXB1bWEtY29tLW1zdXk2bHdtIiwidXJsIjoiaHR0cHM6Ly9pbi5wdW1hLmNvbS9pbi9lbiIsInRpdGxlIjoiUFVNQS5DT00gfCBGb3JldmVyIEZhc3RlciB8IFBVTUEgSW5kaWEiLCJob3N0bmFtZSI6ImluLnB1bWEuY29tIiwib3ZlcmFsbFNjb3JlIjo4NywiY2F0ZWdvcmllcyI6W3siaWQiOiJzZW8iLCJuYW1lIjoiU0VPIiwic2NvcmUiOjk5LCJzdW1tYXJ5IjoiIiwiZmluZGluZ3MiOltdLCJidXNpbmVzc0ltcGFjdCI6IiIsIndoeUl0TWF0dGVycyI6IiIsImltcHJvdmVtZW50cyI6W10sImRpZmZpY3VsdHkiOiJFYXN5IiwicHJpb3JpdHkiOiJMb3cifSx7ImlkIjoiYWNjZXNzaWJpbGl0eSIsIm5hbWUiOiJBY2Nlc3NpYmlsaXR5Iiwic2NvcmUiOjk5LCJzdW1tYXJ5IjoiIiwiZmluZGluZ3MiOltdLCJidXNpbmVzc0ltcGFjdCI6IiIsIndoeUl0TWF0dGVycyI6IiIsImltcHJvdmVtZW50cyI6W10sImRpZmZpY3VsdHkiOiJFYXN5IiwicHJpb3JpdHkiOiJMb3cifSx7ImlkIjoidXgiLCJuYW1lIjoiVXNlciBFeHBlcmllbmNlIiwic2NvcmUiOjk2LCJzdW1tYXJ5IjoiIiwiZmluZGluZ3MiOltdLCJidXNpbmVzc0ltcGFjdCI6IiIsIndoeUl0TWF0dGVycyI6IiIsImltcHJvdmVtZW50cyI6W10sImRpZmZpY3VsdHkiOiJFYXN5IiwicHJpb3JpdHkiOiJMb3cifSx7ImlkIjoibW9iaWxlIiwibmFtZSI6Ik1vYmlsZSBFeHBlcmllbmNlIiwic2NvcmUiOjg4LCJzdW1tYXJ5IjoiIiwiZmluZGluZ3MiOltdLCJidXNpbmVzc0ltcGFjdCI6IiIsIndoeUl0TWF0dGVycyI6IiIsImltcHJvdmVtZW50cyI6W10sImRpZmZpY3VsdHkiOiJFYXN5IiwicHJpb3JpdHkiOiJMb3cifSx7ImlkIjoiY29udmVyc2lvbiIsIm5hbWUiOiJDb252ZXJzaW9uIE9wdGltaXphdGlvbiIsInNjb3JlIjo4OCwic3VtbWFyeSI6IiIsImZpbmRpbmdzIjpbXSwiYnVzaW5lc3NJbXBhY3QiOiIiLCJ3aHlJdE1hdHRlcnMiOiIiLCJpbXByb3ZlbWVudHMiOltdLCJkaWZmaWN1bHR5IjoiRWFzeSIsInByaW9yaXR5IjoiTG93In0seyJpZCI6ImJlc3QtcHJhY3RpY2VzIiwibmFtZSI6IkJlc3QgUHJhY3RpY2VzIiwic2NvcmUiOjg4LCJzdW1tYXJ5IjoiIiwiZmluZGluZ3MiOltdLCJidXNpbmVzc0ltcGFjdCI6IiIsIndoeUl0TWF0dGVycyI6IiIsImltcHJvdmVtZW50cyI6W10sImRpZmZpY3VsdHkiOiJFYXN5IiwicHJpb3JpdHkiOiJMb3cifSx7ImlkIjoic2VjdXJpdHkiLCJuYW1lIjoiU2VjdXJpdHkiLCJzY29yZSI6ODAsInN1bW1hcnkiOiIiLCJmaW5kaW5ncyI6W10sImJ1c2luZXNzSW1wYWN0IjoiIiwid2h5SXRNYXR0ZXJzIjoiIiwiaW1wcm92ZW1lbnRzIjpbXSwiZGlmZmljdWx0eSI6IkVhc3kiLCJwcmlvcml0eSI6IkxvdyJ9LHsiaWQiOiJwZXJmb3JtYW5jZSIsIm5hbWUiOiJQZXJmb3JtYW5jZSIsInNjb3JlIjo1Nywic3VtbWFyeSI6IiIsImZpbmRpbmdzIjpbXSwiYnVzaW5lc3NJbXBhY3QiOiIiLCJ3aHlJdE1hdHRlcnMiOiIiLCJpbXByb3ZlbWVudHMiOltdLCJkaWZmaWN1bHR5IjoiRWFzeSIsInByaW9yaXR5IjoiTG93In1dLCJjcmVhdGVkQXQiOiIyMDI2LTA4LTE1VDIyOjI4OjM2LjE0M1oiLCJmYXZvcml0ZSI6ZmFsc2UsInJlY29tbWVuZGF0aW9ucyI6W10sInN0cmVuZ3RocyI6W10sIndlYWtuZXNzZXMiOltdLCJleGVjdXRpdmVTdW1tYXJ5IjoiIiwiYWlQb3dlcmVkIjpmYWxzZX0",
        websiteUrl: "https://in.puma.com"
      },
      {
        name: "www.crazeproducts.com",
        description: "Craze Biscuits | Premium Heritage Biscuit Brand",
        score: 90,
        metrics: [
          "Mobile Experience 99",
          "Security 99",
          "Best Practices 99"
        ],
        reportUrl: "https://webauditnine.vercel.app/report/www-crazeproducts-com-msuy604p?d=eyJpZCI6Ind3dy1jcmF6ZXByb2R1Y3RzLWNvbS1tc3V5NjA0cCIsInVybCI6Imh0dHBzOi8vd3d3LmNyYXplcHJvZHVjdHMuY29tLyIsInRpdGxlIjoiQ3JhemUgQmlzY3VpdHMgfCBQcmVtaXVtIEhlcml0YWdlIEJpc2N1aXQgQnJhbmQgZnJvbSBLZXJhbGEiLCJob3N0bmFtZSI6Ind3dy5jcmF6ZXByb2R1Y3RzLmNvbSIsIm92ZXJhbGxTY29yZSI6OTAsImNhdGVnb3JpZXMiOlt7ImlkIjoibW9iaWxlIiwibmFtZSI6Ik1vYmlsZSBFeHBlcmllbmNlIiwic2NvcmUiOjk5LCJzdW1tYXJ5IjoiIiwiZmluZGluZ3MiOltdLCJidXNpbmVzc0ltcGFjdCI6IiIsIndoeUl0TWF0dGVycyI6IiIsImltcHJvdmVtZW50cyI6W10sImRpZmZpY3VsdHkiOiJFYXN5IiwicHJpb3JpdHkiOiJMb3cifSx7ImlkIjoic2VjdXJpdHkiLCJuYW1lIjoiU2VjdXJpdHkiLCJzY29yZSI6OTksInN1bW1hcnkiOiIiLCJmaW5kaW5ncyI6W10sImJ1c2luZXNzSW1wYWN0IjoiIiwid2h5SXRNYXR0ZXJzIjoiIiwiaW1wcm92ZW1lbnRzIjpbXSwiZGlmZmljdWx0eSI6IkVhc3kiLCJwcmlvcml0eSI6IkxvdyJ9LHsiaWQiOiJiZXN0LXByYWN0aWNlcyIsIm5hbWUiOiJCZXN0IFByYWN0aWNlcyIsInNjb3JlIjo5OSwic3VtbWFyeSI6IiIsImZpbmRpbmdzIjpbXSwiYnVzaW5lc3NJbXBhY3QiOiIiLCJ3aHlJdE1hdHRlcnMiOiIiLCJpbXByb3ZlbWVudHMiOltdLCJkaWZmaWN1bHR5IjoiRWFzeSIsInByaW9yaXR5IjoiTG93In0seyJpZCI6ImFjY2Vzc2liaWxpdHkiLCJuYW1lIjoiQWNjZXNzaWJpbGl0eSIsInNjb3JlIjo5Niwic3VtbWFyeSI6IiIsImZpbmRpbmdzIjpbXSwiYnVzaW5lc3NJbXBhY3QiOiIiLCJ3aHlJdE1hdHRlcnMiOiIiLCJpbXByb3ZlbWVudHMiOltdLCJkaWZmaWN1bHR5IjoiRWFzeSIsInByaW9yaXR5IjoiTG93In0seyJpZCI6InNlbyIsIm5hbWUiOiJTRU8iLCJzY29yZSI6OTIsInN1bW1hcnkiOiIiLCJmaW5kaW5ncyI6W10sImJ1c2luZXNzSW1wYWN0IjoiIiwid2h5SXRNYXR0ZXJzIjoiIiwiaW1wcm92ZW1lbnRzIjpbXSwiZGlmZmljdWx0eSI6IkVhc3kiLCJwcmlvcml0eSI6IkxvdyJ9LHsiaWQiOiJwZXJmb3JtYW5jZSIsIm5hbWUiOiJQZXJmb3JtYW5jZSIsInNjb3JlIjo5MSwic3VtbWFyeSI6IiIsImZpbmRpbmdzIjpbXSwiYnVzaW5lc3NJbXBhY3QiOiIiLCJ3aHlJdE1hdHRlcnMiOiIiLCJpbXByb3ZlbWVudHMiOltdLCJkaWZmaWN1bHR5IjoiRWFzeSIsInByaW9yaXR5IjoiTG93In0seyJpZCI6InV4IiwibmFtZSI6IlVzZXIgRXhwZXJpZW5jZSIsInNjb3JlIjo4Niwic3VtbWFyeSI6IiIsImZpbmRpbmdzIjpbXSwiYnVzaW5lc3NJbXBhY3QiOiIiLCJ3aHlJdE1hdHRlcnMiOiIiLCJpbXByb3ZlbWVudHMiOltdLCJkaWZmaWN1bHR5IjoiRWFzeSIsInByaW9yaXR5IjoiTG93In0seyJpZCI6ImNvbnZlcnNpb24iLCJuYW1lIjoiQ29udmVyc2lvbiBPcHRpbWl6YXRpb24iLCJzY29yZSI6NjEsInN1bW1hcnkiOiIiLCJmaW5kaW5ncyI6W10sImJ1c2luZXNzSW1wYWN0IjoiIiwid2h5SXRNYXR0ZXJzIjoiIiwiaW1wcm92ZW1lbnRzIjpbXSwiZGlmZmljdWx0eSI6IkVhc3kiLCJwcmlvcml0eSI6IkxvdyJ9XSwiY3JlYXRlZEF0IjoiMjAyNi0wOC0xNVQyMjoyODowNy45NzZaIiwiZmF2b3JpdGUiOmZhbHNlLCJyZWNvbW1lbmRhdGlvbnMiOltdLCJzdHJlbmd0aHMiOltdLCJ3ZWFrbmVzc2VzIjpbXSwiZXhlY3V0aXZlU3VtbWFyeSI6IiIsImFpUG93ZXJlZCI6ZmFsc2V9",
        websiteUrl: "https://www.crazeproducts.com"
      },
      {
        name: "www.vagma.in",
        description: "Vagma - Limitation Jeweller in Kerala",
        score: 83,
        metrics: [
          "SEO 96",
          "Accessibility 90",
          "Mobile Experience 88"
        ],
        reportUrl: "https://webauditnine.vercel.app/report/www-vagma-in-mstxkwh1?d=eyJpZCI6Ind3dy12YWdtYS1pbi1tc3R4a3doMSIsInVybCI6Imh0dHBzOi8vd3d3LnZhZ21hLmluLyIsInRpdGxlIjoiVmFnbWEg4oCTIEJ1eSBJbWl0YXRpb24gSmV3ZWxsZXJ5IGluIEtlcmFsYSAmYW1wOyBJbmRpYSB8IEJyaWRhbCwgVGVtcGxlICZhbXA7IEFudGlxdWUgRGVzaWducyIsImhvc3RuYW1lIjoid3d3LnZhZ21hLmluIiwib3ZlcmFsbFNjb3JlIjo4MywiY2F0ZWdvcmllcyI6W3siaWQiOiJzZW8iLCJuYW1lIjoiU0VPIiwic2NvcmUiOjk2LCJzdW1tYXJ5IjoiIiwiZmluZGluZ3MiOltdLCJidXNpbmVzc0ltcGFjdCI6IiIsIndoeUl0TWF0dGVycyI6IiIsImltcHJvdmVtZW50cyI6W10sImRpZmZpY3VsdHkiOiJFYXN5IiwicHJpb3JpdHkiOiJMb3cifSx7ImlkIjoiYWNjZXNzaWJpbGl0eSIsIm5hbWUiOiJBY2Nlc3NpYmlsaXR5Iiwic2NvcmUiOjkwLCJzdW1tYXJ5IjoiIiwiZmluZGluZ3MiOltdLCJidXNpbmVzc0ltcGFjdCI6IiIsIndoeUl0TWF0dGVycyI6IiIsImltcHJvdmVtZW50cyI6W10sImRpZmZpY3VsdHkiOiJFYXN5IiwicHJpb3JpdHkiOiJMb3cifSx7ImlkIjoibW9iaWxlIiwibmFtZSI6Ik1vYmlsZSBFeHBlcmllbmNlIiwic2NvcmUiOjg4LCJzdW1tYXJ5IjoiIiwiZmluZGluZ3MiOltdLCJidXNpbmVzc0ltcGFjdCI6IiIsIndoeUl0TWF0dGVycyI6IiIsImltcHJvdmVtZW50cyI6W10sImRpZmZpY3VsdHkiOiJFYXN5IiwicHJpb3JpdHkiOiJMb3cifSx7ImlkIjoic2VjdXJpdHkiLCJuYW1lIjoiU2VjdXJpdHkiLCJzY29yZSI6ODgsInN1bW1hcnkiOiIiLCJmaW5kaW5ncyI6W10sImJ1c2luZXNzSW1wYWN0IjoiIiwid2h5SXRNYXR0ZXJzIjoiIiwiaW1wcm92ZW1lbnRzIjpbXSwiZGlmZmljdWx0eSI6IkVhc3kiLCJwcmlvcml0eSI6IkxvdyJ9LHsiaWQiOiJiZXN0LXByYWN0aWNlcyIsIm5hbWUiOiJCZXN0IFByYWN0aWNlcyIsInNjb3JlIjo4OCwic3VtbWFyeSI6IiIsImZpbmRpbmdzIjpbXSwiYnVzaW5lc3NJbXBhY3QiOiIiLCJ3aHlJdE1hdHRlcnMiOiIiLCJpbXByb3ZlbWVudHMiOltdLCJkaWZmaWN1bHR5IjoiRWFzeSIsInByaW9yaXR5IjoiTG93In0seyJpZCI6InV4IiwibmFtZSI6IlVzZXIgRXhwZXJpZW5jZSIsInNjb3JlIjo4Niwic3VtbWFyeSI6IiIsImZpbmRpbmdzIjpbXSwiYnVzaW5lc3NJbXBhY3QiOiIiLCJ3aHlJdE1hdHRlcnMiOiIiLCJpbXByb3ZlbWVudHMiOltdLCJkaWZmaWN1bHR5IjoiRWFzeSIsInByaW9yaXR5IjoiTG93In0seyJpZCI6ImNvbnZlcnNpb24iLCJuYW1lIjoiQ29udmVyc2lvbiBPcHRpbWl6YXRpb24iLCJzY29yZSI6ODQsInN1bW1hcnkiOiIiLCJmaW5kaW5ncyI6W10sImJ1c2luZXNzSW1wYWN0IjoiIiwid2h5SXRNYXR0ZXJzIjoiIiwiaW1wcm92ZW1lbnRzIjpbXSwiZGlmZmljdWx0eSI6IkVhc3kiLCJwcmlvcml0eSI6IkxvdyJ9LHsiaWQiOiJwZXJmb3JtYW5jZSIsIm5hbWUiOiJQZXJmb3JtYW5jZSIsInNjb3JlIjo0NSwic3VtbWFyeSI6IiIsImZpbmRpbmdzIjpbXSwiYnVzaW5lc3NJbXBhY3QiOiIiLCJ3aHlJdE1hdHRlcnMiOiIiLCJpbXByb3ZlbWVudHMiOltdLCJkaWZmaWN1bHR5IjoiRWFzeSIsInByaW9yaXR5IjoiTG93In1dLCJjcmVhdGVkQXQiOiIyMDI2LTA4LTE1VDA1OjIzOjU3Ljg5MloiLCJmYXZvcml0ZSI6ZmFsc2UsInJlY29tbWVuZGF0aW9ucyI6W10sInN0cmVuZ3RocyI6W10sIndlYWtuZXNzZXMiOltdLCJleGVjdXRpdmVTdW1tYXJ5IjoiIiwiYWlQb3dlcmVkIjpmYWxzZX0",
        websiteUrl: "https://www.vagma.in"
      },
      {
        name: "thashreefa.in",
        description: "Best Digital Marketing Strategist in Kannur",
        score: 83,
        metrics: [
          "Mobile Experience 99",
          "Best Practices 94",
          "SEO 92"
        ],
        reportUrl: "https://webauditnine.vercel.app/report/thashreefa-in-mss57asf?d=eyJpZCI6InRoYXNocmVlZmEtaW4tbXNzNTdhc2YiLCJ1cmwiOiJodHRwczovL3RoYXNocmVlZmEuaW4vIiwidGl0bGUiOiJCZXN0IERpZ2l0YWwgTWFya2V0aW5nIFN0cmF0ZWdpc3QgaW4gS2FubnVyIHwgVGhhc2hyZWVmYSIsImhvc3RuYW1lIjoidGhhc2hyZWVmYS5pbiIsIm92ZXJhbGxTY29yZSI6ODMsImNhdGVnb3JpZXMiOlt7ImlkIjoibW9iaWxlIiwibmFtZSI6Ik1vYmlsZSBFeHBlcmllbmNlIiwic2NvcmUiOjk5LCJzdW1tYXJ5IjoiIiwiZmluZGluZ3MiOltdLCJidXNpbmVzc0ltcGFjdCI6IiIsIndoeUl0TWF0dGVycyI6IiIsImltcHJvdmVtZW50cyI6W10sImRpZmZpY3VsdHkiOiJFYXN5IiwicHJpb3JpdHkiOiJMb3cifSx7ImlkIjoiYmVzdC1wcmFjdGljZXMiLCJuYW1lIjoiQmVzdCBQcmFjdGljZXMiLCJzY29yZSI6OTQsInN1bW1hcnkiOiIiLCJmaW5kaW5ncyI6W10sImJ1c2luZXNzSW1wYWN0IjoiIiwid2h5SXRNYXR0ZXJzIjoiIiwiaW1wcm92ZW1lbnRzIjpbXSwiZGlmZmljdWx0eSI6IkVhc3kiLCJwcmlvcml0eSI6IkxvdyJ9LHsiaWQiOiJzZW8iLCJuYW1lIjoiU0VPIiwic2NvcmUiOjkyLCJzdW1tYXJ5IjoiIiwiZmluZGluZ3MiOltdLCJidXNpbmVzc0ltcGFjdCI6IiIsIndoeUl0TWF0dGVycyI6IiIsImltcHJvdmVtZW50cyI6W10sImRpZmZpY3VsdHkiOiJFYXN5IiwicHJpb3JpdHkiOiJMb3cifSx7ImlkIjoidXgiLCJuYW1lIjoiVXNlciBFeHBlcmllbmNlIiwic2NvcmUiOjg2LCJzdW1tYXJ5IjoiIiwiZmluZGluZ3MiOltdLCJidXNpbmVzc0ltcGFjdCI6IiIsIndoeUl0TWF0dGVycyI6IiIsImltcHJvdmVtZW50cyI6W10sImRpZmZpY3VsdHkiOiJFYXN5IiwicHJpb3JpdHkiOiJMb3cifSx7ImlkIjoiY29udmVyc2lvbiIsIm5hbWUiOiJDb252ZXJzaW9uIE9wdGltaXphdGlvbiIsInNjb3JlIjo4NCwic3VtbWFyeSI6IiIsImZpbmRpbmdzIjpbXSwiYnVzaW5lc3NJbXBhY3QiOiIiLCJ3aHlJdE1hdHRlcnMiOiIiLCJpbXByb3ZlbWVudHMiOltdLCJkaWZmaWN1bHR5IjoiRWFzeSIsInByaW9yaXR5IjoiTG93In0seyJpZCI6InNlY3VyaXR5IiwibmFtZSI6IlNlY3VyaXR5Iiwic2NvcmUiOjgwLCJzdW1tYXJ5IjoiIiwiZmluZGluZ3MiOltdLCJidXNpbmVzc0ltcGFjdCI6IiIsIndoeUl0TWF0dGVycyI6IiIsImltcHJvdmVtZW50cyI6W10sImRpZmZpY3VsdHkiOiJFYXN5IiwicHJpb3JpdHkiOiJMb3cifSx7ImlkIjoiYWNjZXNzaWJpbGl0eSIsIm5hbWUiOiJBY2Nlc3NpYmlsaXR5Iiwic2NvcmUiOjc0LCJzdW1tYXJ5IjoiIiwiZmluZGluZ3MiOltdLCJidXNpbmVzc0ltcGFjdCI6IiIsIndoeUl0TWF0dGVycyI6IiIsImltcHJvdmVtZW50cyI6W10sImRpZmZpY3VsdHkiOiJFYXN5IiwicHJpb3JpdHkiOiJMb3cifSx7ImlkIjoicGVyZm9ybWFuY2UiLCJuYW1lIjoiUGVyZm9ybWFuY2UiLCJzY29yZSI6NTIsInN1bW1hcnkiOiIiLCJmaW5kaW5ncyI6W10sImJ1c2luZXNzSW1wYWN0IjoiIiwid2h5SXRNYXR0ZXJzIjoiIiwiaW1wcm92ZW1lbnRzIjpbXSwiZGlmZmljdWx0eSI6IkVhc3kiLCJwcmlvcml0eSI6IkxvdyJ9XSwiY3JlYXRlZEF0IjoiMjAyNi0wOC0xM1QyMzoyMTo0OC4wOTdaIiwiZmF2b3JpdGUiOmZhbHNlLCJyZWNvbW1lbmRhdGlvbnMiOltdLCJzdHJlbmd0aHMiOltdLCJ3ZWFrbmVzc2VzIjpbXSwiZXhlY3V0aXZlU3VtbWFyeSI6IiIsImFpUG93ZXJlZCI6ZmFsc2V9",
        websiteUrl: "https://thashreefa.in"
      }
    ];

    const directory = document.getElementById("directory");

    directory.innerHTML = websites.map(site => `
      <article class="audit-card">

        <div class="card-header">
          <div>
            <h2 class="website-name">${site.name}</h2>
            <p class="website-description">${site.description}</p>
          </div>

          <div class="score">${site.score}</div>
        </div>

        <div class="progress-track">
          <div
            class="progress-bar"
            style="width: ${site.score}%"
          ></div>
        </div>

        <div class="badges">
          ${site.metrics
            .map(metric => `<span class="badge">${metric}</span>`)
            .join("")}
        </div>

        <div class="card-footer">
          <a
            href="${site.reportUrl}"
            class="report-link"
          >
            View report ↗
          </a>

          <a
            href="${site.websiteUrl}"
            class="directory-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            ☆ Directory entry
          </a>
        </div>

      </article>
    `).join("");
  </script>

</body>
</html>
