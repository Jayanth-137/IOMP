# import scrapy
# from table_extractor.items import TableExtractorItem
# from datetime import datetime

# today = datetime.today().strftime("%d-%b-%Y")
# today = "18-May-2025"

# class TableSpider(scrapy.Spider):
#     name = 'table_spider'

#     def start_requests(self):
#         url = (
#             f"https://agmarknet.gov.in/SearchCmmMkt.aspx?"
#             f"Tx_Commodity=2&Tx_State=TL&Tx_District=0&Tx_Market=0"
#             f"&DateFrom={today}&DateTo={today}&Fr_Date={today}&To_Date={today}"
#             f"&Tx_Trend=0&Tx_CommodityHead=Paddy(Dhan)(Common)"
#             f"&Tx_StateHead=Telangana&Tx_DistrictHead=--Select--&Tx_MarketHead=--Select--"
#         )

#         headers = {
#         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
#         "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
#         "Accept-Language": "en-US,en;q=0.5",
#         "Accept-Encoding": "gzip, deflate",
#         "Connection": "keep-alive",
#         "Upgrade-Insecure-Requests": "1",
#         "Sec-Fetch-Dest": "document",
#         "Sec-Fetch-Mode": "navigate",
#         "Sec-Fetch-Site": "none",
#         "Sec-Fetch-User": "?1",
#         "Cache-Control": "max-age=0",
#     }


#         self.logger.info(f"Sending request to {url} with headers")
#         yield scrapy.Request(url=url, headers=headers, callback=self.parse)

#     def parse(self, response):
#         if response.status == 403:
#             self.logger.warning("Received 403 Forbidden - Possible bot block or missing headers")
#             with open("403.html", "wb") as f:
#                 f.write(response.body)

#         table = response.css('table.tableagmark_new')

#         for row in table.css('tr')[1:]:  # Skip header row
#             item = TableExtractorItem()
#             row_data = []

#             for td in row.css('td'):
#                 span_text = td.css('span::text').get()
#                 if span_text:
#                     row_data.append(span_text.strip())
#                 else:
#                     row_data.append(' '.join(td.css('::text').getall()).strip())

#             if row_data:
#                 item['sl_no'] = row_data[0]
#                 item['district'] = row_data[1]
#                 item['market'] = row_data[2]
#                 item['commodity'] = row_data[3]
#                 item['variety'] = row_data[4]
#                 item['grade'] = row_data[5]
#                 item['min_price'] = row_data[6]
#                 item['max_price'] = row_data[7]
#                 item['modal_price'] = row_data[8]
#                 item['price_date'] = row_data[9]

#                 yield item
#===============================================================

# import scrapy
# from table_extractor.items import TableExtractorItem
# from datetime import datetime


# # Replace with your actual ZenRows API key
# ZENROWS_API_KEY = 'ea7104d454fdd6eb06b4f4c9595359d6f61052fe'

# today = datetime.today().strftime("%d-%b-%Y")
# today = "18-May-2025"  # Hardcoded for now

# from urllib.parse import urlencode

# def get_zenrows_api_url(target_url, api_key):
#     payload = {
#         'url': target_url,
#         'js_render': 'true',
#         'premium_proxy': 'true'
#     }
#     return f'https://api.zenrows.com/v1/?apikey={api_key}&{urlencode(payload)}'


# class TableSpider(scrapy.Spider):
#     name = 'table_spider'

#     def start_requests(self):
#         target_url = (
#             f"https://agmarknet.gov.in/SearchCmmMkt.aspx?"
#             f"Tx_Commodity=2&Tx_State=TL&Tx_District=0&Tx_Market=0"
#             f"&DateFrom={today}&DateTo={today}&Fr_Date={today}&To_Date={today}"
#             f"&Tx_Trend=0&Tx_CommodityHead=Paddy(Dhan)(Common)"
#             f"&Tx_StateHead=Telangana&Tx_DistrictHead=--Select--&Tx_MarketHead=--Select--"
#         )

#         zenrows_url = get_zenrows_api_url(target_url, ZENROWS_API_KEY)

#         headers = {
#             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
#                           '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
#             'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
#             'Accept-Language': 'en-US,en;q=0.5',
#             'Referer': 'https://agmarknet.gov.in/',
#             'Connection': 'keep-alive',
#         }

#         self.logger.info(f"Sending request to ZenRows-proxied URL: {zenrows_url}")
#         yield scrapy.Request(url=zenrows_url, headers=headers, callback=self.parse)

#     def parse(self, response):
#         if response.status == 403:
#             self.logger.warning("Received 403 Forbidden - Possible bot block or missing headers")
#             with open("403.html", "wb") as f:
#                 f.write(response.body)

#         table = response.css('table.tableagmark_new')

#         for row in table.css('tr')[1:]:  # Skip header row
#             item = TableExtractorItem()
#             row_data = []

#             for td in row.css('td'):
#                 span_text = td.css('span::text').get()
#                 if span_text:
#                     row_data.append(span_text.strip())
#                 else:
#                     row_data.append(' '.join(td.css('::text').getall()).strip())

#             if row_data:
#                 item['sl_no'] = row_data[0]
#                 item['district'] = row_data[1]
#                 item['market'] = row_data[2]
#                 item['commodity'] = row_data[3]
#                 item['variety'] = row_data[4]
#                 item['grade'] = row_data[5]
#                 item['min_price'] = row_data[6]
#                 item['max_price'] = row_data[7]
#                 item['modal_price'] = row_data[8]
#                 item['price_date'] = row_data[9]

#                 yield item
#===============================================================

import scrapy
from table_extractor.items import TableExtractorItem
from datetime import datetime
from scrapy.exceptions import CloseSpider
from twisted.web._newclient import ResponseNeverReceived
from twisted.internet.error import DNSLookupError, TimeoutError, TCPTimedOutError
from scrapy.spidermiddlewares.httperror import HttpError

today = datetime.today().strftime("%d-%b-%Y")
# today = "18-May-2025"  # For testing purposes

class TableSpider(scrapy.Spider):
    name = 'table_spider'
    
    # Custom settings can be added here
    custom_settings = {
        'DOWNLOAD_DELAY': 2,  # Add delay between requests
        'RETRY_TIMES': 3,    # Retry failed requests
        'COOKIES_ENABLED': True,  # Enable cookies
        'HTTPCACHE_ENABLED': False,  # Disable caching for debugging
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }

    def start_requests(self):
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Referer": "https://agmarknet.gov.in/",
            "DNT": "1",
        }
        
        # First request to get session cookies
        yield scrapy.Request(
            url="https://agmarknet.gov.in/",
            headers=headers,
            callback=self.initial_request,
            errback=self.handle_error
        )

    def initial_request(self, response):
        # Now make the actual request with session cookies

        print(today)
        url = (
            f"https://agmarknet.gov.in/SearchCmmMkt.aspx?"
            f"Tx_Commodity=2&Tx_State=TL&Tx_District=0&Tx_Market=0"
            f"&DateFrom={today}&DateTo={today}&Fr_Date={today}&To_Date={today}"
            f"&Tx_Trend=0&Tx_CommodityHead=Paddy(Dhan)(Common)"
            f"&Tx_StateHead=Telangana&Tx_DistrictHead=--Select--&Tx_MarketHead=--Select--"
        )

        # url = "https://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=2&Tx_State=TL&Tx_District=0&Tx_Market=0&DateFrom=01-Sep-2025&DateTo=29-Oct-2025&Fr_Date=01-Sep-2025&To_Date=29-Oct-2025&Tx_Trend=0&Tx_CommodityHead=Paddy(Dhan)(Common)&Tx_StateHead=Telangana&Tx_DistrictHead=--Select--&Tx_MarketHead=--Select--"
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Referer": "https://agmarknet.gov.in/",
            "Origin": "https://agmarknet.gov.in",
        }
        
        yield scrapy.Request(
            url=url,
            headers=headers,
            callback=self.parse,
            errback=self.handle_error,
            meta={'dont_merge_cookies': True}  # Preserve cookies from initial request
        )

    def parse(self, response):
        if response.status == 403:
            self.logger.error(f"403 Forbidden - Possible bot detection. Response body saved to 403.html")
            with open("403.html", "wb") as f:
                f.write(response.body)
            return
        
        self.logger.info(f"Successfully fetched page: {response.url}")
        
        table = response.css('table.tableagmark_new')
        
        if not table:
            self.logger.warning("No table found on page")
            return

        for row in table.css('tr')[1:]:  # Skip header row
            item = TableExtractorItem()
            row_data = []

            for td in row.css('td'):
                span_text = td.css('span::text').get()
                if span_text:
                    row_data.append(span_text.strip())
                else:
                    row_data.append(' '.join(td.css('::text').getall()).strip())

            if row_data and len(row_data) >= 10:  # Ensure we have all columns
                item['sl_no'] = row_data[0]
                item['district'] = row_data[1]
                item['market'] = row_data[2]
                item['commodity'] = row_data[3]
                item['variety'] = row_data[4]
                item['grade'] = row_data[5]
                item['min_price'] = row_data[6]
                item['max_price'] = row_data[7]
                item['modal_price'] = row_data[8]
                item['price_date'] = row_data[9]

                yield item

    def handle_error(self, failure):
        self.logger.error(repr(failure))
        
        if failure.check(HttpError):
            response = failure.value.response
            self.logger.error(f'HttpError on {response.url} - Status: {response.status}')
            
        elif failure.check(DNSLookupError):
            request = failure.request
            self.logger.error(f'DNSLookupError on {request.url}')
            
        elif failure.check(TimeoutError):
            request = failure.request
            self.logger.error(f'TimeoutError on {request.url}')