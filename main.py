from datetime import datetime
from typing import Any

import yaml  # type: ignore
from jinja2 import Environment, FileSystemLoader


class Portfolio:
    def __init__(self):
        self.config_files = {
            "profile": "config/profile.yml",
            "about": "config/about.yml",
            "resume": "config/resume.yml",
            "projects": "config/projects.yml",
            "publications": "config/publications.yml",
            "blog": "config/blog.yml",
            "contact": "config/contact.yml",
            "navbar": "config/navbar.yml",
            "talks": "config/talks.yml",
        }
        self.env = Environment(loader=FileSystemLoader("src/jinja"))
        self.env.filters["format_date"] = self.format_date

    def read_file(self, file_path: str) -> str:
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read()

    def write_file(self, file_path: str, content: str) -> None:
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(content)

    def load_config_file(self, file_key: str) -> dict[str, Any]:
        file_path = self.config_files.get(file_key)
        content = self.read_file(file_path)
        return yaml.load(content, Loader=yaml.FullLoader)

    def format_date(self, date_str: str) -> str:
        date_object = datetime.strptime(date_str, "%Y-%m-%d")
        return date_object.strftime("%b %d, %Y")

    def render_template(
        self, template_name: str, output_path: str, context: dict[str, Any]
    ) -> None:
        template = self.env.get_template(template_name)
        html_render = template.render(context)
        self.write_file(output_path, html_render)


if __name__ == "__main__":
    portfolio = Portfolio()
    context = {key: portfolio.load_config_file(key) for key in portfolio.config_files}
    portfolio.render_template("index.j2", "index.html", context)
    # Write internal blog post stubs if any post URLs point to local html under posts/
    try:
        blog_cfg = context.get("blog", {})
        posts = blog_cfg.get("POSTS", []) if isinstance(blog_cfg, dict) else []
        for post in posts:
            url = post.get("url")
            title = post.get("title", "")
            published = post.get("published", "")
            if isinstance(url, str) and not url.startswith("http") and url.endswith(".html"):
                # ensure the directory exists and write a minimal HTML if file doesn't exist
                import os
                os.makedirs(os.path.dirname(url), exist_ok=True)
                if not os.path.exists(url):
                    html = f"""<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>{title}</title>\n  <link rel=\"stylesheet\" href=\"../src/css/style.css\">\n</head>\n<body>\n  <main style=\"max-width: 760px; margin: 40px auto; padding: 0 16px; color: var(--white-2);\">\n    <h1 style=\"margin-bottom: 8px;\">{title}</h1>\n    <p style=\"color: var(--light-gray-70); margin-bottom: 20px;\">{published}</p>\n    <article>\n      <p>Start writing your post content here. You can replace this file with your full article.</p>\n    </article>\n    <p style=\"margin-top: 24px;\"><a href=\"../index.html#blog\">← Back to Blog</a></p>\n  </main>\n</body>\n</html>\n"""
                    self = portfolio
                    self.write_file(url, html)
    except Exception:
        # non-fatal; skip stub generation errors
        pass
