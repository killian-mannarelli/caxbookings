# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from pyexpat import model
from django.conf import settings
from django.db import models

#region AutoGenerated

class ColumnsPriv(models.Model):
    # Field name made lowercase.
    host = models.CharField(db_column='Host', primary_key=True,
                            max_length=255, db_collation='ascii_general_ci')
    # Field name made lowercase.
    db = models.CharField(db_column='Db', max_length=64)
    # Field name made lowercase.
    user = models.CharField(db_column='User', max_length=32)
    # Field name made lowercase.
    table_name = models.CharField(db_column='Table_name', max_length=64)
    # Field name made lowercase.
    column_name = models.CharField(db_column='Column_name', max_length=64)
    # Field name made lowercase.
    timestamp = models.DateTimeField(db_column='Timestamp')
    # Field name made lowercase.
    column_priv = models.CharField(
        db_column='Column_priv', max_length=31, db_collation='utf8_general_ci')

    class Meta:
        managed = False
        db_table = 'columns_priv'
        unique_together = (
            ('host', 'db', 'user', 'table_name', 'column_name'),)


class Component(models.Model):
    component_id = models.AutoField(primary_key=True)
    component_group_id = models.PositiveIntegerField()
    component_urn = models.TextField()

    class Meta:
        managed = False
        db_table = 'component'


class Db(models.Model):
    # Field name made lowercase.
    host = models.CharField(db_column='Host', primary_key=True,
                            max_length=255, db_collation='ascii_general_ci')
    # Field name made lowercase.
    db = models.CharField(db_column='Db', max_length=64)
    # Field name made lowercase.
    user = models.CharField(db_column='User', max_length=32)
    # Field name made lowercase.
    select_priv = models.CharField(
        db_column='Select_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    insert_priv = models.CharField(
        db_column='Insert_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    update_priv = models.CharField(
        db_column='Update_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    delete_priv = models.CharField(
        db_column='Delete_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    create_priv = models.CharField(
        db_column='Create_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    drop_priv = models.CharField(
        db_column='Drop_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    grant_priv = models.CharField(
        db_column='Grant_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    references_priv = models.CharField(
        db_column='References_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    index_priv = models.CharField(
        db_column='Index_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    alter_priv = models.CharField(
        db_column='Alter_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    create_tmp_table_priv = models.CharField(
        db_column='Create_tmp_table_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    lock_tables_priv = models.CharField(
        db_column='Lock_tables_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    create_view_priv = models.CharField(
        db_column='Create_view_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    show_view_priv = models.CharField(
        db_column='Show_view_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    create_routine_priv = models.CharField(
        db_column='Create_routine_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    alter_routine_priv = models.CharField(
        db_column='Alter_routine_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    execute_priv = models.CharField(
        db_column='Execute_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    event_priv = models.CharField(
        db_column='Event_priv', max_length=1, db_collation='utf8_general_ci')
    # Field name made lowercase.
    trigger_priv = models.CharField(
        db_column='Trigger_priv', max_length=1, db_collation='utf8_general_ci')

    class Meta:
        managed = False
        db_table = 'db'
        unique_together = (('host', 'db', 'user'),)


class DefaultRoles(models.Model):
    # Field name made lowercase.
    host = models.CharField(db_column='HOST', primary_key=True,
                            max_length=255, db_collation='ascii_general_ci')
    # Field name made lowercase.
    user = models.CharField(db_column='USER', max_length=32)
    # Field name made lowercase.
    default_role_host = models.CharField(
        db_column='DEFAULT_ROLE_HOST', max_length=255, db_collation='ascii_general_ci')
    # Field name made lowercase.
    default_role_user = models.CharField(
        db_column='DEFAULT_ROLE_USER', max_length=32)

    class Meta:
        managed = False
        db_table = 'default_roles'
        unique_together = (
            ('host', 'user', 'default_role_host', 'default_role_user'),)


class EngineCost(models.Model):
    engine_name = models.CharField(max_length=64)
    device_type = models.IntegerField()
    cost_name = models.CharField(primary_key=True, max_length=64)
    cost_value = models.FloatField(blank=True, null=True)
    last_update = models.DateTimeField()
    comment = models.CharField(max_length=1024, blank=True, null=True)
    default_value = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'engine_cost'
        unique_together = (('cost_name', 'engine_name', 'device_type'),)


class Func(models.Model):
    name = models.CharField(primary_key=True, max_length=64)
    ret = models.IntegerField()
    dl = models.CharField(max_length=128)
    type = models.CharField(max_length=9, db_collation='utf8_general_ci')

    class Meta:
        managed = False
        db_table = 'func'


class GeneralLog(models.Model):
    event_time = models.DateTimeField()
    user_host = models.TextField()
    thread_id = models.PositiveBigIntegerField()
    server_id = models.PositiveIntegerField()
    command_type = models.CharField(max_length=64)
    argument = models.TextField()

    class Meta:
        managed = False
        db_table = 'general_log'


class GlobalGrants(models.Model):
    # Field name made lowercase.
    user = models.CharField(db_column='USER', primary_key=True, max_length=32)
    # Field name made lowercase.
    host = models.CharField(db_column='HOST', max_length=255,
                            db_collation='ascii_general_ci')
    # Field name made lowercase.
    priv = models.CharField(db_column='PRIV', max_length=32,
                            db_collation='utf8_general_ci')
    # Field name made lowercase.
    with_grant_option = models.CharField(
        db_column='WITH_GRANT_OPTION', max_length=1, db_collation='utf8_general_ci')

    class Meta:
        managed = False
        db_table = 'global_grants'
        unique_together = (('user', 'host', 'priv'),)


class GtidExecuted(models.Model):
    source_uuid = models.CharField(primary_key=True, max_length=36)
    interval_start = models.BigIntegerField()
    interval_end = models.BigIntegerField()

    class Meta:
        managed = False
        db_table = 'gtid_executed'
        unique_together = (('source_uuid', 'interval_start'),)


class HelpCategory(models.Model):
    help_category_id = models.PositiveSmallIntegerField(primary_key=True)
    name = models.CharField(unique=True, max_length=64)
    parent_category_id = models.PositiveSmallIntegerField(
        blank=True, null=True)
    url = models.TextField()

    class Meta:
        managed = False
        db_table = 'help_category'


class HelpKeyword(models.Model):
    help_keyword_id = models.PositiveIntegerField(primary_key=True)
    name = models.CharField(unique=True, max_length=64)

    class Meta:
        managed = False
        db_table = 'help_keyword'


class HelpRelation(models.Model):
    help_topic_id = models.PositiveIntegerField()
    help_keyword_id = models.PositiveIntegerField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'help_relation'
        unique_together = (('help_keyword_id', 'help_topic_id'),)


class HelpTopic(models.Model):
    help_topic_id = models.PositiveIntegerField(primary_key=True)
    name = models.CharField(unique=True, max_length=64)
    help_category_id = models.PositiveSmallIntegerField()
    description = models.TextField()
    example = models.TextField()
    url = models.TextField()

    class Meta:
        managed = False
        db_table = 'help_topic'


class InnodbIndexStats(models.Model):
    database_name = models.CharField(primary_key=True, max_length=64)
    table_name = models.CharField(max_length=199)
    index_name = models.CharField(max_length=64)
    last_update = models.DateTimeField()
    stat_name = models.CharField(max_length=64)
    stat_value = models.PositiveBigIntegerField()
    sample_size = models.PositiveBigIntegerField(blank=True, null=True)
    stat_description = models.CharField(max_length=1024)

    class Meta:
        managed = False
        db_table = 'innodb_index_stats'
        unique_together = (('database_name', 'table_name',
                           'index_name', 'stat_name'),)


class InnodbTableStats(models.Model):
    database_name = models.CharField(primary_key=True, max_length=64)
    table_name = models.CharField(max_length=199)
    last_update = models.DateTimeField()
    n_rows = models.PositiveBigIntegerField()
    clustered_index_size = models.PositiveBigIntegerField()
    sum_of_other_index_sizes = models.PositiveBigIntegerField()

    class Meta:
        managed = False
        db_table = 'innodb_table_stats'
        unique_together = (('database_name', 'table_name'),)


class PasswordHistory(models.Model):
    # Field name made lowercase.
    host = models.CharField(db_column='Host', primary_key=True,
                            max_length=255, db_collation='ascii_general_ci')
    # Field name made lowercase.
    user = models.CharField(db_column='User', max_length=32)
    # Field name made lowercase.
    password_timestamp = models.DateTimeField(db_column='Password_timestamp')
    # Field name made lowercase.
    password = models.TextField(db_column='Password', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'password_history'
        unique_together = (('host', 'user', 'password_timestamp'),)


class Plugin(models.Model):
    name = models.CharField(primary_key=True, max_length=64)
    dl = models.CharField(max_length=128)

    class Meta:
        managed = False
        db_table = 'plugin'


class ProcsPriv(models.Model):
    # Field name made lowercase.
    host = models.CharField(db_column='Host', primary_key=True,
                            max_length=255, db_collation='ascii_general_ci')
    # Field name made lowercase.
    db = models.CharField(db_column='Db', max_length=64)
    # Field name made lowercase.
    user = models.CharField(db_column='User', max_length=32)
    # Field name made lowercase.
    routine_name = models.CharField(
        db_column='Routine_name', max_length=64, db_collation='utf8_general_ci')
    # Field name made lowercase.
    routine_type = models.CharField(db_column='Routine_type', max_length=9)
    # Field name made lowercase.
    grantor = models.CharField(db_column='Grantor', max_length=288)
    # Field name made lowercase.
    proc_priv = models.CharField(
        db_column='Proc_priv', max_length=27, db_collation='utf8_general_ci')
    # Field name made lowercase.
    timestamp = models.DateTimeField(db_column='Timestamp')

    class Meta:
        managed = False
        db_table = 'procs_priv'
        unique_together = (
            ('host', 'db', 'user', 'routine_name', 'routine_type'),)


class ProxiesPriv(models.Model):
    # Field name made lowercase.
    host = models.CharField(db_column='Host', primary_key=True,
                            max_length=255, db_collation='ascii_general_ci')
    # Field name made lowercase.
    user = models.CharField(db_column='User', max_length=32)
    # Field name made lowercase.
    proxied_host = models.CharField(
        db_column='Proxied_host', max_length=255, db_collation='ascii_general_ci')
    # Field name made lowercase.
    proxied_user = models.CharField(db_column='Proxied_user', max_length=32)
    # Field name made lowercase.
    with_grant = models.IntegerField(db_column='With_grant')
    # Field name made lowercase.
    grantor = models.CharField(db_column='Grantor', max_length=288)
    # Field name made lowercase.
    timestamp = models.DateTimeField(db_column='Timestamp')

    class Meta:
        managed = False
        db_table = 'proxies_priv'
        unique_together = (('host', 'user', 'proxied_host', 'proxied_user'),)


class ReplicationAsynchronousConnectionFailover(models.Model):
    # Field name made lowercase.
    channel_name = models.CharField(
        db_column='Channel_name', primary_key=True, max_length=64)
    # Field name made lowercase.
    host = models.CharField(db_column='Host', max_length=255,
                            db_collation='ascii_general_ci')
    # Field name made lowercase.
    port = models.PositiveIntegerField(db_column='Port')
    # Field name made lowercase.
    network_namespace = models.CharField(
        db_column='Network_namespace', max_length=64)
    # Field name made lowercase.
    weight = models.PositiveIntegerField(db_column='Weight')
    # Field name made lowercase.
    managed_name = models.CharField(db_column='Managed_name', max_length=64)

    class Meta:
        managed = False
        db_table = 'replication_asynchronous_connection_failover'
        unique_together = (('channel_name', 'host', 'port',
                           'network_namespace', 'managed_name'),)


class ReplicationAsynchronousConnectionFailoverManaged(models.Model):
    # Field name made lowercase.
    channel_name = models.CharField(
        db_column='Channel_name', primary_key=True, max_length=64)
    # Field name made lowercase.
    managed_name = models.CharField(db_column='Managed_name', max_length=64)
    # Field name made lowercase.
    managed_type = models.CharField(db_column='Managed_type', max_length=64)
    # Field name made lowercase.
    configuration = models.JSONField(
        db_column='Configuration', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'replication_asynchronous_connection_failover_managed'
        unique_together = (('channel_name', 'managed_name'),)


class ReplicationGroupConfigurationVersion(models.Model):
    name = models.CharField(primary_key=True, max_length=255,
                            db_collation='ascii_general_ci')
    version = models.PositiveBigIntegerField()

    class Meta:
        managed = False
        db_table = 'replication_group_configuration_version'


class ReplicationGroupMemberActions(models.Model):
    name = models.CharField(primary_key=True, max_length=255,
                            db_collation='ascii_general_ci')
    event = models.CharField(max_length=64, db_collation='ascii_general_ci')
    enabled = models.IntegerField()
    type = models.CharField(max_length=64, db_collation='ascii_general_ci')
    priority = models.PositiveIntegerField()
    error_handling = models.CharField(
        max_length=64, db_collation='ascii_general_ci')

    class Meta:
        managed = False
        db_table = 'replication_group_member_actions'
        unique_together = (('name', 'event'),)


class RoleEdges(models.Model):
    # Field name made lowercase.
    from_host = models.CharField(
        db_column='FROM_HOST', primary_key=True, max_length=255, db_collation='ascii_general_ci')
    # Field name made lowercase.
    from_user = models.CharField(db_column='FROM_USER', max_length=32)
    # Field name made lowercase.
    to_host = models.CharField(
        db_column='TO_HOST', max_length=255, db_collation='ascii_general_ci')
    # Field name made lowercase.
    to_user = models.CharField(db_column='TO_USER', max_length=32)
    # Field name made lowercase.
    with_admin_option = models.CharField(
        db_column='WITH_ADMIN_OPTION', max_length=1, db_collation='utf8_general_ci')

    class Meta:
        managed = False
        db_table = 'role_edges'
        unique_together = (('from_host', 'from_user', 'to_host', 'to_user'),)


class ServerCost(models.Model):
    cost_name = models.CharField(primary_key=True, max_length=64)
    cost_value = models.FloatField(blank=True, null=True)
    last_update = models.DateTimeField()
    comment = models.CharField(max_length=1024, blank=True, null=True)
    default_value = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'server_cost'


class Servers(models.Model):
    # Field name made lowercase.
    server_name = models.CharField(
        db_column='Server_name', primary_key=True, max_length=64)
    # Field name made lowercase.
    host = models.CharField(db_column='Host', max_length=255,
                            db_collation='ascii_general_ci')
    # Field name made lowercase.
    db = models.CharField(db_column='Db', max_length=64)
    # Field name made lowercase.
    username = models.CharField(db_column='Username', max_length=64)
    # Field name made lowercase.
    password = models.CharField(db_column='Password', max_length=64)
    port = models.IntegerField(db_column='Port')  # Field name made lowercase.
    # Field name made lowercase.
    socket = models.CharField(db_column='Socket', max_length=64)
    # Field name made lowercase.
    wrapper = models.CharField(db_column='Wrapper', max_length=64)
    # Field name made lowercase.
    owner = models.CharField(db_column='Owner', max_length=64)

    class Meta:
        managed = False
        db_table = 'servers'


class SlaveMasterInfo(models.Model):
    # Field name made lowercase.
    number_of_lines = models.PositiveIntegerField(db_column='Number_of_lines')
    # Field name made lowercase.
    master_log_name = models.TextField(
        db_column='Master_log_name', db_collation='utf8_bin')
    # Field name made lowercase.
    master_log_pos = models.PositiveBigIntegerField(db_column='Master_log_pos')
    # Field name made lowercase.
    host = models.CharField(db_column='Host', max_length=255,
                            db_collation='ascii_general_ci', blank=True, null=True)
    # Field name made lowercase.
    user_name = models.TextField(
        db_column='User_name', db_collation='utf8_bin', blank=True, null=True)
    # Field name made lowercase.
    user_password = models.TextField(
        db_column='User_password', db_collation='utf8_bin', blank=True, null=True)
    # Field name made lowercase.
    port = models.PositiveIntegerField(db_column='Port')
    # Field name made lowercase.
    connect_retry = models.PositiveIntegerField(db_column='Connect_retry')
    # Field name made lowercase.
    enabled_ssl = models.IntegerField(db_column='Enabled_ssl')
    # Field name made lowercase.
    ssl_ca = models.TextField(
        db_column='Ssl_ca', db_collation='utf8_bin', blank=True, null=True)
    # Field name made lowercase.
    ssl_capath = models.TextField(
        db_column='Ssl_capath', db_collation='utf8_bin', blank=True, null=True)
    # Field name made lowercase.
    ssl_cert = models.TextField(
        db_column='Ssl_cert', db_collation='utf8_bin', blank=True, null=True)
    # Field name made lowercase.
    ssl_cipher = models.TextField(
        db_column='Ssl_cipher', db_collation='utf8_bin', blank=True, null=True)
    # Field name made lowercase.
    ssl_key = models.TextField(
        db_column='Ssl_key', db_collation='utf8_bin', blank=True, null=True)
    # Field name made lowercase.
    ssl_verify_server_cert = models.IntegerField(
        db_column='Ssl_verify_server_cert')
    # Field name made lowercase.
    heartbeat = models.FloatField(db_column='Heartbeat')
    # Field name made lowercase.
    bind = models.TextField(
        db_column='Bind', db_collation='utf8_bin', blank=True, null=True)
    # Field name made lowercase.
    ignored_server_ids = models.TextField(
        db_column='Ignored_server_ids', db_collation='utf8_bin', blank=True, null=True)
    # Field name made lowercase.
    uuid = models.TextField(
        db_column='Uuid', db_collation='utf8_bin', blank=True, null=True)
    # Field name made lowercase.
    retry_count = models.PositiveBigIntegerField(db_column='Retry_count')
    # Field name made lowercase.
    ssl_crl = models.TextField(
        db_column='Ssl_crl', db_collation='utf8_bin', blank=True, null=True)
    # Field name made lowercase.
    ssl_crlpath = models.TextField(
        db_column='Ssl_crlpath', db_collation='utf8_bin', blank=True, null=True)
    # Field name made lowercase.
    enabled_auto_position = models.IntegerField(
        db_column='Enabled_auto_position')
    # Field name made lowercase.
    channel_name = models.CharField(
        db_column='Channel_name', primary_key=True, max_length=64)
    # Field name made lowercase.
    tls_version = models.TextField(
        db_column='Tls_version', db_collation='utf8_bin', blank=True, null=True)
    # Field name made lowercase.
    public_key_path = models.TextField(
        db_column='Public_key_path', db_collation='utf8_bin', blank=True, null=True)
    # Field name made lowercase.
    get_public_key = models.IntegerField(db_column='Get_public_key')
    # Field name made lowercase.
    network_namespace = models.TextField(
        db_column='Network_namespace', db_collation='utf8_bin', blank=True, null=True)
    master_compression_algorithm = models.CharField(
        db_column='Master_compression_algorithm', max_length=64, db_collation='utf8_bin')  # Field name made lowercase.
    master_zstd_compression_level = models.PositiveIntegerField(
        db_column='Master_zstd_compression_level')  # Field name made lowercase.
    # Field name made lowercase.
    tls_ciphersuites = models.TextField(
        db_column='Tls_ciphersuites', db_collation='utf8_bin', blank=True, null=True)
    source_connection_auto_failover = models.IntegerField(
        db_column='Source_connection_auto_failover')  # Field name made lowercase.
    # Field name made lowercase.
    gtid_only = models.IntegerField(db_column='Gtid_only')

    class Meta:
        managed = False
        db_table = 'slave_master_info'


class SlaveRelayLogInfo(models.Model):
    # Field name made lowercase.
    number_of_lines = models.PositiveIntegerField(db_column='Number_of_lines')
    # Field name made lowercase.
    relay_log_name = models.TextField(
        db_column='Relay_log_name', db_collation='utf8_bin', blank=True, null=True)
    # Field name made lowercase.
    relay_log_pos = models.PositiveBigIntegerField(
        db_column='Relay_log_pos', blank=True, null=True)
    # Field name made lowercase.
    master_log_name = models.TextField(
        db_column='Master_log_name', db_collation='utf8_bin', blank=True, null=True)
    master_log_pos = models.PositiveBigIntegerField(
        db_column='Master_log_pos', blank=True, null=True)  # Field name made lowercase.
    # Field name made lowercase.
    sql_delay = models.IntegerField(
        db_column='Sql_delay', blank=True, null=True)
    number_of_workers = models.PositiveIntegerField(
        db_column='Number_of_workers', blank=True, null=True)  # Field name made lowercase.
    # Field name made lowercase.
    id = models.PositiveIntegerField(db_column='Id', blank=True, null=True)
    # Field name made lowercase.
    channel_name = models.CharField(
        db_column='Channel_name', primary_key=True, max_length=64)
    # Field name made lowercase.
    privilege_checks_username = models.CharField(
        db_column='Privilege_checks_username', max_length=32, db_collation='utf8_bin', blank=True, null=True)
    privilege_checks_hostname = models.CharField(db_column='Privilege_checks_hostname', max_length=255,
                                                 db_collation='ascii_general_ci', blank=True, null=True)  # Field name made lowercase.
    # Field name made lowercase.
    require_row_format = models.IntegerField(db_column='Require_row_format')
    require_table_primary_key_check = models.CharField(
        db_column='Require_table_primary_key_check', max_length=6)  # Field name made lowercase.
    assign_gtids_to_anonymous_transactions_type = models.CharField(
        db_column='Assign_gtids_to_anonymous_transactions_type', max_length=5)  # Field name made lowercase.
    assign_gtids_to_anonymous_transactions_value = models.TextField(
        db_column='Assign_gtids_to_anonymous_transactions_value', db_collation='utf8_bin', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'slave_relay_log_info'


class SlaveWorkerInfo(models.Model):
    # Field name made lowercase.
    id = models.PositiveIntegerField(db_column='Id')
    # Field name made lowercase.
    relay_log_name = models.TextField(
        db_column='Relay_log_name', db_collation='utf8_bin')
    # Field name made lowercase.
    relay_log_pos = models.PositiveBigIntegerField(db_column='Relay_log_pos')
    # Field name made lowercase.
    master_log_name = models.TextField(
        db_column='Master_log_name', db_collation='utf8_bin')
    # Field name made lowercase.
    master_log_pos = models.PositiveBigIntegerField(db_column='Master_log_pos')
    # Field name made lowercase.
    checkpoint_relay_log_name = models.TextField(
        db_column='Checkpoint_relay_log_name', db_collation='utf8_bin')
    checkpoint_relay_log_pos = models.PositiveBigIntegerField(
        db_column='Checkpoint_relay_log_pos')  # Field name made lowercase.
    # Field name made lowercase.
    checkpoint_master_log_name = models.TextField(
        db_column='Checkpoint_master_log_name', db_collation='utf8_bin')
    checkpoint_master_log_pos = models.PositiveBigIntegerField(
        db_column='Checkpoint_master_log_pos')  # Field name made lowercase.
    # Field name made lowercase.
    checkpoint_seqno = models.PositiveIntegerField(
        db_column='Checkpoint_seqno')
    # Field name made lowercase.
    checkpoint_group_size = models.PositiveIntegerField(
        db_column='Checkpoint_group_size')
    # Field name made lowercase.
    checkpoint_group_bitmap = models.TextField(
        db_column='Checkpoint_group_bitmap')
    # Field name made lowercase.
    channel_name = models.CharField(
        db_column='Channel_name', primary_key=True, max_length=64)

    class Meta:
        managed = False
        db_table = 'slave_worker_info'
        unique_together = (('channel_name', 'id'),)


class SlowLog(models.Model):
    start_time = models.DateTimeField()
    user_host = models.TextField()
    query_time = models.TimeField()
    lock_time = models.TimeField()
    rows_sent = models.IntegerField()
    rows_examined = models.IntegerField()
    db = models.CharField(max_length=512)
    last_insert_id = models.IntegerField()
    insert_id = models.IntegerField()
    server_id = models.PositiveIntegerField()
    sql_text = models.TextField()
    thread_id = models.PositiveBigIntegerField()

    class Meta:
        managed = False
        db_table = 'slow_log'


class TablesPriv(models.Model):
    # Field name made lowercase.
    host = models.CharField(db_column='Host', primary_key=True,
                            max_length=255, db_collation='ascii_general_ci')
    # Field name made lowercase.
    db = models.CharField(db_column='Db', max_length=64)
    # Field name made lowercase.
    user = models.CharField(db_column='User', max_length=32)
    # Field name made lowercase.
    table_name = models.CharField(db_column='Table_name', max_length=64)
    # Field name made lowercase.
    grantor = models.CharField(db_column='Grantor', max_length=288)
    # Field name made lowercase.
    timestamp = models.DateTimeField(db_column='Timestamp')
    # Field name made lowercase.
    table_priv = models.CharField(
        db_column='Table_priv', max_length=98, db_collation='utf8_general_ci')
    # Field name made lowercase.
    column_priv = models.CharField(
        db_column='Column_priv', max_length=31, db_collation='utf8_general_ci')

    class Meta:
        managed = False
        db_table = 'tables_priv'
        unique_together = (('host', 'db', 'user', 'table_name'),)


class TimeZone(models.Model):
    # Field name made lowercase.
    time_zone_id = models.AutoField(db_column='Time_zone_id', primary_key=True)
    # Field name made lowercase.
    use_leap_seconds = models.CharField(
        db_column='Use_leap_seconds', max_length=1)

    class Meta:
        managed = False
        db_table = 'time_zone'


class TimeZoneLeapSecond(models.Model):
    # Field name made lowercase.
    transition_time = models.BigIntegerField(
        db_column='Transition_time', primary_key=True)
    # Field name made lowercase.
    correction = models.IntegerField(db_column='Correction')

    class Meta:
        managed = False
        db_table = 'time_zone_leap_second'


class TimeZoneName(models.Model):
    # Field name made lowercase.
    name = models.CharField(db_column='Name', primary_key=True, max_length=64)
    # Field name made lowercase.
    time_zone_id = models.PositiveIntegerField(db_column='Time_zone_id')

    class Meta:
        managed = False
        db_table = 'time_zone_name'


# The TimeZoneTransition class is a model that represents the time_zone_transition table in the
# database
class TimeZoneTransition(models.Model):
    # Field name made lowercase.
    time_zone_id = models.PositiveIntegerField(
        db_column='Time_zone_id', primary_key=True)
    # Field name made lowercase.
    transition_time = models.BigIntegerField(db_column='Transition_time')
    # Field name made lowercase.
    transition_type_id = models.PositiveIntegerField(
        db_column='Transition_type_id')

    class Meta:
        managed = False
        db_table = 'time_zone_transition'
        unique_together = (('time_zone_id', 'transition_time'),)


# The TimeZoneTransitionType class is a model that represents the time_zone_transition_type table in
# the database
class TimeZoneTransitionType(models.Model):
    # Field name made lowercase.
    time_zone_id = models.PositiveIntegerField(
        db_column='Time_zone_id', primary_key=True)
    # Field name made lowercase.
    transition_type_id = models.PositiveIntegerField(
        db_column='Transition_type_id')
    # Field name made lowercase.
    offset = models.IntegerField(db_column='Offset')
    # Field name made lowercase.
    is_dst = models.PositiveIntegerField(db_column='Is_DST')
    # Field name made lowercase.
    abbreviation = models.CharField(db_column='Abbreviation', max_length=8)

    class Meta:
        managed = False
        db_table = 'time_zone_transition_type'
        unique_together = (('time_zone_id', 'transition_type_id'),)

#endregion


# The Rooms class is a model that has an id field that is an AutoField, a name field that is a
# CharField, and a Meta class that has a managed attribute set to True and a db_table attribute set to
# 'rooms'
class Rooms(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=False, null=False, default="Ney Room")

    class Meta:
        managed = False
        db_table = 'rooms'


# The class Computers is a model that has an id, status, name, and room. The id is an auto field that
# is the primary key. The status is an integer field that is not blank, null, or defaulted to 1. The
# name is a char field that is not blank, null, or defaulted to "New PC". The room is a foreign key to
# the Rooms model
class Computers(models.Model):
    id = models.AutoField(primary_key=True)
    status = models.IntegerField(blank=True, null=False, default=1)
    name = models.CharField(max_length=255, blank=True, null=False, default="New PC")
    host_name = models.CharField(max_length=255, blank=True, null=False) 
    room = models.ForeignKey('Rooms', models.DO_NOTHING, blank=False, null=False)

    class Meta:
        managed = True
        db_table = 'computers'


# The class ComputerInRoom is a model that has the following fields: computer_id, computer_name,
# room_id, computer_status, next_booking_time
class ComputerInRoom(models.Model):
    computer_id = models.IntegerField(primary_key=True)
    computer_name = models.CharField(max_length=255, blank=True, null=False, default="New PC")
    room_id = models.IntegerField()
    computer_status = models.IntegerField()
    next_booking_time = models.DateTimeField(blank=True, null=True )

    class Meta:
        managed = False
        db_table = 'computer_in_room'


# The RoomSearch class is a model that has 4 fields: room_id, room_name, room_capacity, and
# room_current_capacity
class RoomSearch(models.Model):
    room_id = models.IntegerField(primary_key=True)
    room_name = models.CharField(max_length=255, blank=True, null=True)
    room_capacity = models.IntegerField(blank=True, null=True)
    room_current_capacity = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'room_search'

# The Bookings class is a model that represents a booking. It has a user, a computer, a start time, an
# end time, and a status

class Bookings(models.Model):
    id = models.AutoField(db_column='booking_id', primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             models.DO_NOTHING, blank=True, null=True)
    computer = models.ForeignKey(
        'Computers', models.DO_NOTHING, blank=False, null=False)
    start = models.DateTimeField(blank=False, null=False, db_column='start_time')
    end = models.DateTimeField(blank=False, null=False, db_column='end_time')
    status = models.IntegerField(blank=True, null=False, db_column='status', default=1)

    class Meta:
        managed = True
        db_table = 'bookings'

# The RoomBooked class is a model that has three fields: room_id, room_name, and room_booking_count
class RoomBooked(models.Model):
    room_id = models.IntegerField(primary_key=True)
    room_name = models.CharField(max_length=255, blank=True, null=True)
    room_booking_count = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'room_booked'


# The GlobalVariables class is a model that has two fields: name and value. The name field is a
# CharField with a max length of 255 characters and is the primary key. The value field is a CharField
# with a max length of 255 characters and is not nullable
class GlobalVariables(models.Model):
    name = models.CharField(max_length=255, primary_key=True)
    value = models.CharField(max_length=255, null=False)

    class Meta:
        managed = False
        db_table = 'global_variables'


# `UserInfos` is a model that has a `user_id` field that is the primary key, a `username` field that
# is a `CharField` with a max length of 255, a `is_superuser` field that is a `BooleanField`, a
# `is_staff` field that is a `BooleanField`, a `nb_in_process_bookings` field that is an
# `IntegerField`, a `nb_total_bookings` field that is an `IntegerField`, a `nb_passed_bookings` field
# that is an `IntegerField`, a `nb_canceled_bookings` field that is an `IntegerField`, and a
# `avg_booking_time` field that is a `CharField` with a max length of 255
class UserInfos(models.Model):
    user_id = models.IntegerField(primary_key=True)
    username = models.CharField(max_length=255, blank=True, null=True)
    is_superuser = models.BooleanField(blank=True, null=True)
    is_staff = models.BooleanField(blank=True, null=True)
    nb_in_process_bookings = models.IntegerField(blank=True, null=True)
    nb_total_bookings = models.IntegerField(blank=True, null=True)
    nb_passed_bookings = models.IntegerField(blank=True, null=True)
    nb_canceled_bookings = models.IntegerField(blank=True, null=True)
    avg_booking_time = models.CharField(max_length=255, blank=True, null=True)
    
    class Meta:
        managed = False
        db_table = 'user_info'
    
    
class RoomEquipment(models.Model):
    id = models.AutoField(db_column="id",primary_key=True)
    equipment_name = models.CharField(max_length=255, null=False, blank=False)
        
    class Meta:
        managed = False
        db_table = 'room_equipment'

class EquipmentInRoom(models.Model):
    id = models.AutoField(primary_key=True)
    equipment_id =models.ForeignKey(RoomEquipment, models.DO_NOTHING )
    room_id = models.ForeignKey(Rooms, models.DO_NOTHING )
    
    class Meta:
        managed = False
        db_table= 'rel_table_equipment_room'

class RoomWithEquipmentName(models.Model):
    id = models.IntegerField(primary_key=True)
    room_id = models.IntegerField(null=False, blank=False)
    equipment_name = models.CharField(max_length=255, null=False, blank=False)
    
    class Meta:
        managed = False
        db_table = 'room_with_equipment_name'
