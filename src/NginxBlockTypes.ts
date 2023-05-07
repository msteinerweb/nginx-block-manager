// NginxTypes.ts

export type NginxCommonKey =
    | 'root'
    | 'index'
    | 'location'
    | 'proxy_pass'
    | 'proxy_http_version'
    | 'proxy_set_header'
    | 'proxy_read_timeout'
    | 'proxy_send_timeout'
    | 'client_max_body_size'
    | 'gzip'
    | 'gzip_types';

export type NginxServerKey =
    | NginxCommonKey
    | 'listen'
    | 'server_name'
    | 'access_log'
    | 'error_log'
    | 'include'
    | 'proxy_connect_timeout'
    | 'fastcgi_pass'
    | 'fastcgi_param'
    | 'fastcgi_index'
    | 'fastcgi_split_path_info'
    | 'gzip_disable'
    | 'ssl_certificate'
    | 'ssl_certificate_key'
    | 'ssl_protocols'
    | 'ssl_ciphers'
    | 'ssl_session_cache'
    | 'ssl_session_timeout'
    | 'ssl_prefer_server_ciphers'
    | 'ssl_stapling'
    | 'ssl_stapling_verify'
    | 'resolver';

export type NginxLocationKey =
    | NginxCommonKey
    | 'autoindex'
    | 'try_files'
    | 'alias'
    | 'error_page'
    | 'rewrite'
    | 'return'
    | 'proxy_buffering'
    | 'add_header'
    | 'expires'
    | 'limit_except'
    | 'limit_rate'
    | 'auth_basic'
    | 'auth_basic_user_file';
