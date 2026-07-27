import urllib.request
import urllib.parse
from html.parser import HTMLParser
import os

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.lines = []
        self.images = []

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == 'img':
            self.images.append((d.get('src'), d.get('alt')))
        elif tag == 'a' and 'href' in d:
            self.lines.append('HREF:' + d['href'])

    def handle_data(self, data):
        s = data.strip()
        if s:
            self.lines.append(s)

pages = ['', 'Информация.html', 'Контакты.html', 'Главная.html']
base = 'https://stapex.nicepage.io/'

out_text = []

for p in pages:
    url = base + urllib.parse.quote(p)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        parser = TextExtractor()
        parser.feed(html)
        p_name = p if p else "INDEX"
        out_text.append(f"=== PAGE: {p_name} ===\n")
        out_text.append('\n'.join(parser.lines))
        out_text.append('\n--- IMAGES ---\n')
        for src, alt in parser.images:
            out_text.append(f"{src} | {alt}\n")
        out_text.append('\n' + '='*60 + '\n')
    except Exception as e:
        out_text.append(f"ERR: {p} {e}\n")

with open('site_scraped_data.txt', 'w', encoding='utf-8') as f:
    f.writelines(out_text)

print('Saved to site_scraped_data.txt')
