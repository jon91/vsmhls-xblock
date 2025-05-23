from importlib.resources import files

import pkg_resources
import logging
from xblock.core import XBlock
from xblock.fields import String, Scope, List
from xblock.fragment import Fragment
from webob import Response
from xblockutils.resources import ResourceLoader

from web_fragments.fragment import Fragment

log = logging.getLogger(__name__)
loader = ResourceLoader(__name__)

@XBlock.wants('settings')
class VSMHLSXBlock(XBlock):
    """
    An XBlock providing a video player with HLS streaming capabilities using Video.js.
    """
    # Fields
    hls_url = String(
        display_name="HLS Stream URL",
        help="URL to the HLS (.m3u8) stream",
        scope=Scope.settings,
        default=""
    )
    poster_url = String(
        display_name="Poster Image URL",
        help="URL to the poster image for the video",
        scope=Scope.settings,
        default=""
    )
    subtitle_urls = List(
        display_name="Subtitle URLs",
        help="List of subtitle URLs in WebVTT format with language codes (e.g., {'url': 'http://example.com/sub.vtt', 'lang': 'en', 'label': 'English'})",
        scope=Scope.settings,
        default=[]
    )

    def resource_string(self, path):
        """Handy helper for getting resources from our package."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    def student_view(self, context=None):
        """
        The primary view of the VSMHLSXBlock, shown to students when viewing courses.
        """
        frag = Fragment()

        context = {
            'hls_url': self.hls_url,
            'poster_url': self.poster_url,
            # Use a proper field for display name (if not set, fall back to a default)
            'xblock_display_name': getattr(self, 'xblock_display_name', 'My Video'),
            'unique_id': str(self.scope_ids.usage_id)
        }

        html = loader.render_template('static/html/hls_video.html', context)
        frag.add_content(html)
        
        # Load external JS library and our initialization script
        frag.add_javascript_url("https://video.vladschool.com/playerjs.js")
        frag.add_javascript(self.resource_string("static/js/player_init.js"))
        
        frag.initialize_js('VSMHLSXBlock')
        return frag

    def studio_view(self, context=None):
        """
        The studio view for editing the XBlock settings.
        """
        ctx = {
            'hls_url': self.hls_url,
            'poster_url': self.poster_url,
            'subtitle_urls': self.subtitle_urls,
            # and potentially title if needed
        }
        html = loader.render_template("static/html/hls_video_edit.html", ctx)
        frag = Fragment(html)
        frag.add_css(self.resource_string("static/css/hls_video_edit.css"))
        frag.add_javascript(self.resource_string("static/js/hls_video_edit.js"))
        frag.initialize_js('VSMHLSXBlockStudio')
        return frag
    
    def save_settings(self, data, suffix=''):
        """
        Save the settings from the studio view with validation.
        """
        if not data.get('hls_url', '').startswith(('http://', 'https://')):
            return {'result': 'error', 'message': 'Invalid HLS URL format'}
            
        if data.get('poster_url') and not data['poster_url'].startswith(('http://', 'https://')):
            return {'result': 'error', 'message': 'Invalid poster URL format'}
            
        # Validate subtitle entries
        for subtitle in data.get('subtitle_urls', []):
            if not all(key in subtitle for key in ['url', 'lang', 'label']):
                return {'result': 'error', 'message': 'Invalid subtitle format'}
                
        self.hls_url = data.get('hls_url', '')
        self.poster_url = data.get('poster_url', '')
        self.subtitle_urls = data.get('subtitle_urls', [])
        return {'result': 'success'}

    @XBlock.json_handler
    def save_settings(self, data, suffix=''):
        """
        Save the settings from the studio view.
        """
        self.hls_url = data.get('hls_url', '')
        self.poster_url = data.get('poster_url', '')
        self.subtitle_urls = data.get('subtitle_urls', [])
        return {'result': 'success'}

    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("HLS Video XBlock",
             """<vsmhls hls_url="https://video.vladschool.com/package/65d23c5d-c73c-4c8c-aa26-b3bad98fc7e7/hls/master.m3u8" poster_url="https://vladschool.com/asset-v1:VladSchool+005+2025+type@asset+block@005.webp"/>
             """)
        ]